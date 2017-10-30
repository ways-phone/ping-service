import { Component } from "@angular/core";
import * as Papa from "papaparse/papaparse.min.js";
import { PingService } from "../ping-service";
import { Promise } from "bluebird";
import { PingRecord } from "../PingRecord";
import { PingFile } from "../PingFile";
import pathParse from "path-parse";
import FileSaver from "file-saver";

import _ from "lodash";

@Component({
  selector: "app-file-reader",
  templateUrl: "./file-reader.component.html",
  styleUrls: ["./file-reader.component.css"],
  providers: [PingService]
})
export class FileReaderComponent {
  errors: Array<string>;
  selectedFile: PingFile;
  returnRecords;
  confirmPing: boolean;
  records: PingRecord[];
  loading: boolean;

  constructor(private pingService: PingService) {
    this.loading = false;
    this.confirmPing = false;
  }

  // Called from the component to reset the page.
  cancel(): void {
    this.clear();
  }

  cancelConfirm() {
    this.confirmPing = false;
  }

  // clears the error and the selected file
  clear(): void {
    this.errors = [];
    this.selectedFile = null;
    this.confirmPing = false;
  }

  // called for each individual record that is pinged.
  private formatPingResponse(response) {
    // get the error from the response
    const error: string = response.DtResponse.ErrorMessage;
    const id: string = response.DtResponse.RequestId;

    // set the error as the status if there is one
    if (error) return { RequestId: id, Status: error };

    // otherwise set the status as set in the result response.
    const result: Array<any> = response.DtResponse.Result;

    if (result.length > 0) {
      return { RequestId: id, Status: result[0].Response };
    }

    return { RequestId: id, Status: "no result provided" };
  }

  // Downloads the ping results as a csv file
  private downloadAsCSV(results) {
    // mutates the original records array and sets the status to the ping response
    results.forEach(record => {
      let current = _.find(this.records, { RequestId: record.RequestId });
      if (!current) return;

      current.Status = record.Status;
    });

    // converts the json to raw csv
    const csv = Papa.unparse(this.records);

    // uses the path library to strip the file type from the filename
    const path = `${pathParse(this.selectedFile.name).name}-pinged.csv`;

    // downloads the csv from the browser
    var blob = new Blob([csv], { type: "data:text/csv;charset=utf-8" });
    FileSaver.saveAs(blob, path);

    // resets the page and hides the loading spinner
    this.clear();
    this.loading = false;
  }
  confirm() {
    this.confirmPing = !this.confirmPing;
  }

  // iterates over all records and calls the Ping Service.
  ping() {
    this.loading = true;
    Promise.map(this.records, record => {
      return this.pingService
        .pingRecord(record)
        .then(this.formatPingResponse)
        .catch(err => console.log(err));
    })
      .then(this.downloadAsCSV.bind(this))
      .catch(err => {
        this.loading = false;
        console.log(err);
      });
  }

  // validates the file and creates Ping Records
  parseFile(file) {
    return results => {
      const json = results.data;

      const isValid = this._validateFile(json[0]);

      if (!isValid) return;

      this.records = json
        .map(record => {
          if (!record.RequestId || !record.PhoneNumber) return;
          return new PingRecord(record.RequestId, record.PhoneNumber);
        })
        .filter(record => record);

      this.selectedFile = new PingFile(file.name, this.records.length);
    };
  }

  // parses the uploaded csv file.
  onChange(files): void {
    this.clear();
    if (files.length < 1) return;
    const file = files[0];

    // currently can only handle csv file
    if (file.name.indexOf(".csv") === -1) {
      this.errors = ["Please only upload a .csv file"];
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: this.parseFile(file).bind(this)
    });
  }

  _validateFile(data: {}): boolean {
    let isValid = true;
    const validKeys = ["RequestId", "PhoneNumber"];
    let messages = [];
    Object.keys(data).forEach(key => {
      if (validKeys.indexOf(key) !== -1) return;

      isValid = false;
      messages.push(`${key} is not a valid column header.`);
    });
    this.errors = messages;
    return isValid;
  }
}
