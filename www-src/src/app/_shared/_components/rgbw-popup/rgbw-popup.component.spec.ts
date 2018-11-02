import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RgbwPopupComponent} from './rgbw-popup.component';
import {CommonTestModule} from 'src/app/_testing/common.test.module';
import {Device} from "../../_models/device";

describe('RgbwPopupComponent', () => {
  let component: RgbwPopupComponent;
  let fixture: ComponentFixture<RgbwPopupComponent>;

  const device: Device = {
    AddjMulti: 1.0,
    AddjMulti2: 1.0,
    AddjValue: 0.0,
    AddjValue2: 0.0,
    BatteryLevel: 100,
    CustomImage: 0,
    Data: '9.0 C, 84 %',
    Description: 'Outdoor sensor',
    DewPoint: '6.44',
    Favorite: 1,
    HardwareID: 2,
    HardwareName: 'RFXCOM',
    HardwareType: 'RFXCOM - RFXtrx433 USB 433.92MHz Transceiver',
    HardwareTypeVal: 1,
    HaveTimeout: false,
    Humidity: 84,
    HumidityStatus: 'Wet',
    ID: '5704',
    LastUpdate: '2018-12-09 09:41:41',
    Name: 'Terrasse',
    Notifications: 'false',
    PlanID: '3',
    PlanIDs: [3],
    Protected: false,
    ShowNotifications: true,
    SignalLevel: 5,
    SubType: 'THGN122/123/132, THGR122/228/238/268',
    Temp: 9.0,
    Timers: 'false',
    Type: 'Temp + Humidity',
    TypeImg: 'temperature',
    Unit: 4,
    Used: 1,
    XOffset: '29',
    YOffset: '44',
    idx: '152'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [CommonTestModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgbwPopupComponent);
    component = fixture.componentInstance;

    component.item = device;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
