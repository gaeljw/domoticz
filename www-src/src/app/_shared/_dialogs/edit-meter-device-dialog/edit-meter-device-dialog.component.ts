import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {DialogComponent} from 'src/app/_shared/_dialogs/dialog.component';
import {DIALOG_DATA, DialogService} from 'src/app/_shared/_services/dialog.service';
import {I18NEXT_SERVICE, ITranslationService} from 'angular-i18next';
import {ReplaceDeviceService} from 'src/app/_shared/_services/replace-device.service';
import {DeviceService} from 'src/app/_shared/_services/device.service';
import {Utils} from 'src/app/_shared/_utils/utils';
import {mergeMap} from 'rxjs/operators';
import {Device} from '../../_models/device';

// FIXME manage with NPM+TypeScript
declare var bootbox: any;

@Component({
  selector: 'dz-edit-meter-device-dialog',
  templateUrl: './edit-meter-device-dialog.component.html',
  styleUrls: ['./edit-meter-device-dialog.component.css']
})
export class EditMeterDeviceDialogComponent extends DialogComponent implements OnInit, AfterViewInit {

  item: Device;
  // FIXME replace those callbacks with a more Angular way to do so
  replaceCallbackFn: () => any;
  removeCallbackFn: () => any;
  updateCallbackFn: (t: Device) => any;

  constructor(
    dialogService: DialogService,
    @Inject(I18NEXT_SERVICE) private translationService: ITranslationService,
    private replaceDeviceService: ReplaceDeviceService,
    private deviceService: DeviceService,
    @Inject(DIALOG_DATA) data: any) {

    super(dialogService);

    this.item = data.item;
    this.replaceCallbackFn = data.replaceCallbackFn;
    this.removeCallbackFn = data.removeCallbackFn;
    this.updateCallbackFn = data.updateCallbackFn;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  protected getDialogId(): string {
    return 'dialog-editmeterdevice';
  }

  protected getDialogTitle(): string {
    return this.translationService.t('Edit Device');
  }

  protected getDialogButtons(): any {
    const dialog_editmeterdevice_buttons = {};

    dialog_editmeterdevice_buttons[this.translationService.t('Update')] = () => {
      let bValid = true;
      let devOptionsParam = '';
      bValid = bValid && Utils.checkLength(this.item.Name, 2, 100);
      if (bValid) {
        if (this.item.SwitchTypeVal === 3) { // Counter
          devOptionsParam = `ValueQuantity:${this.item.ValueQuantity};ValueUnits:${this.item.ValueUnits};`;
        }
        this.close();
        this.deviceService.updateMeterDevice(this.item.idx, this.item.Name, this.item.Description,
          this.item.SwitchTypeVal, this.item.AddjValue, this.item.AddjValue2, devOptionsParam)
          .pipe(
            // Chances are this change other data fields of the widget so we re-get it
            mergeMap(() => this.deviceService.getDeviceInfo(this.item.idx))
          )
          .subscribe(updatedItem => {
            this.updateCallbackFn(updatedItem);
          });
      }
    };

    dialog_editmeterdevice_buttons[this.translationService.t('Remove Device')] = () => {
      this.close();
      bootbox.confirm(this.translationService.t('Are you sure to remove this Device?'), (result) => {
        if (result === true) {
          this.deviceService.removeDevice(this.item.idx, this.item.Name, this.item.Description).subscribe(() => {
            this.removeCallbackFn();
          });
        }
      });
    };

    dialog_editmeterdevice_buttons[this.translationService.t('Replace')] = () => {
      this.close();
      this.replaceDeviceService.ReplaceDevice(this.item.idx, this.replaceCallbackFn);
    };

    dialog_editmeterdevice_buttons[this.translationService.t('Cancel')] = () => {
      this.close();
    };

    return dialog_editmeterdevice_buttons;
  }

  onComboMeterTypeChange() {
    if (this.item.SwitchTypeVal === 3) {
      if ((!this.item.ValueQuantity || this.item.ValueQuantity === '') && (!this.item.ValueUnits || this.item.ValueUnits === '')) {
        this.item.ValueQuantity = 'Count';
      }
    }
  }

}
