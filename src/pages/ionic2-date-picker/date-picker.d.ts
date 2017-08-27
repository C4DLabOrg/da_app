import { Directive } from '@angular/core';
import { EventEmitter } from "@angular/core";
import { ModalController, ViewController } from "ionic-angular";

@Directive({})
export declare class DatePicker {
    modalCtrl: ModalController;
    viewCtrl: ViewController;
    onDateSelected: EventEmitter<Date>;
    onCancelled: EventEmitter<any>;
    public currentMoment;
    private daysGroupedByWeek;
    private selectedDateItem;
    private daysOfMonth;
    private calendarModal;
    private setDate;
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
    
    showCalendar(date): void;
}
