import type { DateTime } from 'luxon';
import type { BookingScheduleObject } from '$lib/scripts/types';

function cron_matches(value: number, cron: string): boolean {
	if (cron.includes(',')) {
		const sub_crons = cron.split(',');
		return sub_crons.some((sc) => cron_matches(value, sc));
	}

	if (cron == '*') {
		return true;
	}

	if (cron.endsWith('-?')) {
		return value >= parseInt(cron.slice(0, -2));
	}

	if (cron.includes('-')) {
		const bounds = cron.split('-');
		const startBound = parseInt(bounds[0]);
		const endBound = parseInt(bounds[1]);
		return startBound <= value && value <= endBound;
	}

	return value == parseInt(cron);
}

class Cron {
	public year_cron: string;
	public month_cron: string;
	public day_cron: string;

	constructor(cron: string) {
		const split_cron = cron.split(' ');
		this.year_cron = split_cron[0];
		this.month_cron = split_cron[1];
		this.day_cron = split_cron[2];
	}

	public toString(): string {
		return `${this.year_cron} ${this.month_cron} ${this.day_cron}`;
	}
}

export class BookingSchedule {
	public readonly cron: Cron;

	constructor(cron: string) {
		this.cron = new Cron(cron);
	}

	public toObject(): BookingScheduleObject {
		return {
			cron: this.cron.toString()
		};
	}

	public static fromObject(data: BookingScheduleObject): BookingSchedule {
		return new BookingSchedule(data.cron);
	}

	static fromDate(date: DateTime): BookingSchedule {
		return new this(`${date.year} ${date.month} ${date.day}`);
	}

	public getBookings(rangeStart: DateTime, rangeEnd: DateTime): DateTime[] {
		const bookings = new Array<DateTime>();
		for (let date = rangeStart; date < rangeEnd; date = date.plus({ days: 1 })) {
			if (!cron_matches(date.day, this.cron.day_cron)) {
				continue;
			}

			if (!cron_matches(date.month, this.cron.month_cron)) {
				continue;
			}

			if (!cron_matches(date.year, this.cron.year_cron)) {
				continue;
			}

			bookings.push(date);
		}

		return bookings;
	}
}
