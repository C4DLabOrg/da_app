var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Output, EventEmitter } from "@angular/core";
import { ModalController, ViewController } from "ionic-angular";
import Moment from "moment";
/*
  Generated class for the DatePicker component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
export var DatePicker = (function () {
    function DatePicker(modalCtrl, viewCtrl) {
        this.modalCtrl = modalCtrl;
        this.viewCtrl = viewCtrl;
        this.onDateSelected = new EventEmitter();
        this.onCancelled = new EventEmitter();
        this.daysGroupedByWeek = [];
        this.currentMoment = Moment();
        this.renderCalender();
    }
    DatePicker.prototype.renderCalender = function () {
        this.daysOfMonth = this.generateDaysOfMonth(this.currentMoment.year(), this.currentMoment.month() + 1, this.currentMoment.date());
        this.daysGroupedByWeek = this.groupByWeek(this.daysOfMonth);
        this.setTodayAsDefaultSelectedDate();
    };
    DatePicker.prototype.generateDaysOfMonth = function (year, month, day) {
        var calendarMonth = Moment(year + "-" + month + "-" + day, "YYYY-MM-DD");
        var startOfMonth = calendarMonth.clone().startOf("month").day("sunday");
        var endOfMonth = calendarMonth.clone().endOf("month").day("saturday");
        var totalDays = endOfMonth.diff(startOfMonth, "days") + 1;
        var calendarDays = [];
        for (var i = 0; i < totalDays; i++) {
            var immunableStartOfMonth = startOfMonth.clone();
            var dateItem = {
                isSelected: false,
                momentDate: immunableStartOfMonth.add(i, "day"),
                isEnabled: this.isBelongToThisMonth(immunableStartOfMonth, month)
            };
            calendarDays.push(dateItem);
        }
        return calendarDays;
    };
    DatePicker.prototype.groupByWeek = function (daysOfMonth) {
        var groupedDaysOfMonth = new Array();
        daysOfMonth.forEach(function (item, index) {
            var groupIndex = Math.floor((index / 7));
            groupedDaysOfMonth[groupIndex] = groupedDaysOfMonth[groupIndex] || [];
            groupedDaysOfMonth[groupIndex].push(item);
        });
        return groupedDaysOfMonth;
    };
    DatePicker.prototype.selectDate = function (day) {
        if (!day.isEnabled)
            return;
        if (this.selectedDateItem && this.selectedDateItem.isSelected) {
            this.selectedDateItem.isSelected = false;
        }
        day.isSelected = true;
        this.selectedDateItem = day;
        this.currentMoment = day.momentDate.clone();
    };
    DatePicker.prototype.setTodayAsDefaultSelectedDate = function () {
        var today = Moment().startOf("day");
        var foundDates = this.daysOfMonth
            .filter(function (item) { return today.isSame(item.momentDate.clone().startOf("day")); });
        if (foundDates && foundDates.length > 0) {
            this.selectedDateItem = foundDates[0];
            this.selectedDateItem.isSelected = true;
        }
    };
    DatePicker.prototype.isBelongToThisMonth = function (momentDate, month) {
        return momentDate.month() + 1 === month;
    };
    DatePicker.prototype.setMonthBack = function () {
        this.currentMoment.subtract(1, "month");
        this.renderCalender();
    };
    DatePicker.prototype.setMonthForward = function () {
        this.currentMoment.add(1, "month");
        this.renderCalender();
    };
    DatePicker.prototype.setYearBack = function () {
        this.currentMoment.subtract(1, "year");
        this.renderCalender();
    };
    DatePicker.prototype.setYearForward = function () {
        this.currentMoment.add(1, "year");
        this.renderCalender();
    };
    DatePicker.prototype.confirmDateSelection = function () {
        this.viewCtrl.dismiss(this.selectedDateItem.momentDate.toDate());
    };
    DatePicker.prototype.cancel = function () {
        this.viewCtrl.dismiss();
    };
    DatePicker.prototype.showCalendar = function () {
        var _this = this;
        this.calendarModal = this.modalCtrl.create(DatePicker);
        this.calendarModal.onDidDismiss(function (data) {
            if (data) {
                _this.onDateSelected.emit(data);
            }
            else {
                _this.onCancelled.emit();
            }
        });
        this.calendarModal.present();
    };
    __decorate([
        Output(), 
        __metadata('design:type', EventEmitter)
    ], DatePicker.prototype, "onDateSelected", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', EventEmitter)
    ], DatePicker.prototype, "onCancelled", void 0);
    DatePicker = __decorate([
        Component({
            selector: "date-picker",
            template: "<div class=\"layout-col horizontal-center\" style=\"background-color:white;height:100%\">\n  <div class=\"layout-col horizontal-center top-banner\">\n    <div class=\"dayofweek padding-5\">{{currentMoment.format('dddd')}}</div>\n    <div class=\"text-center padding-10\">\n      <div class=\"padding-5\">\n        <ion-icon class=\"arrow\" name=\"arrow-back\" (click)=\"setMonthBack()\"></ion-icon>\n        <span class=\"month padding-10\">{{currentMoment.format('MMM')}}</span>\n        <ion-icon class=\"arrow\" name=\"arrow-forward\" (click)=\"setMonthForward()\"></ion-icon>\n      </div>\n      <div class=\"day padding-5\">{{currentMoment.format('D')}}</div>\n      <div class=\"text-center padding-5\">\n        <ion-icon class=\"arrow\" name=\"arrow-back\" (click)=\"setYearBack()\"></ion-icon>\n        <span class=\"year padding-10\">{{currentMoment.format('YYYY')}}</span>\n        <ion-icon class=\"arrow\" name=\"arrow-forward\" (click)=\"setYearForward()\"></ion-icon>\n      </div>\n    </div>\n  </div>\n  <span class=\"month-year\">{{currentMoment.format('MMMM YYYY')}}</span>\n  <div class=\"calendar-item-container\">\n    <div class=\"layout-row day-item-header\" style=\"width:100%;flex-wrap:wrap;text-align:center\">\n    <div>S</div>\n    <div>M</div>\n    <div>T</div>\n    <div>W</div>\n    <div>T</div>\n    <div>F</div>\n    <div>S</div>\n  </div>\n  <div class=\"layout-row\" style=\"width:100%;flex-wrap:wrap;text-align:center\" *ngFor=\"let week of daysGroupedByWeek;\">\n    <div class=\"day-item\" [ngClass]=\"{'selected': day.isSelected, 'disabled': !day.isEnabled}\" *ngFor=\"let day of week;\" (click)=\"selectDate(day)\">{{day.momentDate.date()}}</div>\n  </div>\n  </div>\n  <div class=\"layout-row\" style=\"width:100%;justify-content:Flex-end;margin:10px;\">\n    <button ion-button style=\"color:grey\" clear (click)=\"cancel()\">Cancel</button>\n    <button ion-button clear (click)=\"confirmDateSelection()\">OK</button>\n  </div>\n\n\n</div>"
        }), 
        __metadata('design:paramtypes', [ModalController, ViewController])
    ], DatePicker);
    return DatePicker;
}());
//# sourceMappingURL=date-picker.js.map