import { EventEmitter } from "@angular/core";
import { ModalController, ViewController } from "ionic-angular";
export declare class DatePicker {
    modalCtrl: ModalController;
    viewCtrl: ViewController;
    onDateSelected: EventEmitter<Date>;
    onCancelled: EventEmitter<any>;
    private currentMoment;
    private daysGroupedByWeek;
    private selectedDateItem;
    private daysOfMonth;
    private calendarModal;
    constructor(modalCtrl: ModalController, viewCtrl: ViewController);
    private renderCalender();
    private generateDaysOfMonth(year, month, day);
    private groupByWeek(daysOfMonth);
    private selectDate(day);
    private setTodayAsDefaultSelectedDate();
    private isBelongToThisMonth(momentDate, month);
    private setMonthBack();
    private setMonthForward();
    private setYearBack();
    private setYearForward();
    private confirmDateSelection();
    private cancel();
    showCalendar(): void;
}
