import { TransferTimespan } from '$lib/scripts/transfer-timespan';
import { BookingSchedule } from '$lib/scripts/booking-schedule';
import { DateTime } from 'luxon';
import { v4 as UUID } from 'uuid';
import type { CSVRow, TransferObject } from '$lib/scripts/types';

export class Transfer {
	public id: string;
	public name: string;
	public amount: number;
	public timespan: TransferTimespan;
	public schedule: BookingSchedule;
	public firstBooking: DateTime;
	public lastBooking?: DateTime;

	constructor(
		name: string,
		amount: number,
		timespan: TransferTimespan,
		schedule: BookingSchedule,
		firstBooking: DateTime,
		lastBooking?: DateTime,
		id?: string
	) {
		this.id = id ?? UUID();
		this.name = name;
		this.amount = amount;
		this.timespan = timespan;
		this.schedule = schedule;
		this.firstBooking = firstBooking;
		this.lastBooking = lastBooking;
	}

	public toObject(): TransferObject {
		return {
			id: this.id,
			name: this.name,
			amount: this.amount,
			timespan: this.timespan.valueOf(),
			schedule: this.schedule.toObject(),
			firstBooking: this.firstBooking.toMillis(),
			lastBooking: this.lastBooking?.toMillis()
		};
	}

	public toCSV(): CSVRow {
		return [
			this.textifyCsv(this.name),
			this.amount,
			this.textifyCsv(
				this.isOneOff
					? 'one-off'
					: this.timespan == TransferTimespan.yearly
					? 'yearly'
					: this.timespan == TransferTimespan.monthly
					? 'monthly'
					: this.timespan == TransferTimespan.daily
					? 'daily'
					: ''
			),
			this.textifyCsv(this.schedule.cron.toString()),
			this.textifyCsv(this.firstBooking.toISODate() ?? ''),
			this.textifyCsv(this.lastBooking?.toISODate() ?? '')
		];
	}

	private textifyCsv(value: string): string {
		if (value.length == 0) {
			return value;
		}
		return `"${value.replaceAll('"', '""')}"`;
	}

	public static fromObject(data: TransferObject): Transfer {
		return new Transfer(
			data.name,
			data.amount,
			TransferTimespan[TransferTimespan[data.timespan] as keyof typeof TransferTimespan],
			BookingSchedule.fromObject(data.schedule),
			DateTime.fromMillis(data.firstBooking),
			data.lastBooking ? DateTime.fromMillis(data.lastBooking) : undefined
		);
	}

	public static fromCsv(data: string[]): Transfer {
		return new Transfer(
			data[0],
			parseFloat(data[1]),
			data[2] == 'yearly'
				? TransferTimespan.yearly
				: data[2] == 'monthly'
				? TransferTimespan.monthly
				: TransferTimespan.daily,
			BookingSchedule.fromObject({ cron: data[3] }),
			DateTime.fromISO(data[4]),
			data[5].length > 0 ? DateTime.fromISO(data[5]) : undefined
		);
	}

	public get isOneOff(): boolean {
		return this.lastBooking?.equals(this.firstBooking) ?? false;
	}

	public getBookings(rangeStart: DateTime, rangeEnd: DateTime): DateTime[] {
		const searchStart = rangeStart >= this.firstBooking ? rangeStart : this.firstBooking;
		const searchEnd =
			this.lastBooking == undefined
				? rangeEnd
				: rangeEnd <= this.lastBooking.plus({ days: 1 })
				? rangeEnd
				: this.lastBooking.plus({ days: 1 });
		return this.schedule.getBookings(searchStart, searchEnd);
	}

	public getBookingAmount(bookingDate: DateTime): number {
		let timespanStart: DateTime;
		let timespanEnd: DateTime;

		switch (this.timespan) {
			case TransferTimespan.yearly:
				timespanStart = bookingDate.startOf('year');
				timespanEnd = timespanStart.plus({ years: 1 });
				break;
			case TransferTimespan.monthly:
				timespanStart = bookingDate.startOf('month');
				timespanEnd = timespanStart.plus({ months: 1 });
				break;
			case TransferTimespan.daily:
				return this.amount;
			default:
				throw Error('Timespan not supported');
		}

		const bookingsInTimespan = this.schedule.getBookings(timespanStart, timespanEnd);
		return this.amount / bookingsInTimespan.length;
	}
}
