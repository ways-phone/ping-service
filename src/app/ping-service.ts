import {Injectable} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';

import {RequestKey} from './key';

import 'rxjs/add/operator/toPromise';

const REQUEST_KEY = RequestKey();

@Injectable()
export class PingService {
  url = 'https://kleber.datatoolscloud.net.au/KleberWebService/DtKleberService.svc/ProcessQueryStringRequest';

  constructor(private http: Http) {}

  pingRecord(record) {
    const config = {
      ...record,
      RequestKey: REQUEST_KEY,
      Method:
        'DataTools.Verify.PhoneNumber.ReachTel.VerifyPhoneNumberIsConnected',
      OutputFormat: 'json',
    };

    // angualr way of setting the params property for the GET request.
    let requestOptions = new RequestOptions();
    requestOptions.params = config;

    return this.http
      .get(this.url, requestOptions)
      .toPromise()
      .then(response => response.json());
  }
}
