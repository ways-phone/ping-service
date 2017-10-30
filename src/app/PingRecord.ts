
export class PingRecord {
    constructor(id, number) {
        this.RequestId = id;
        this.PhoneNumber = number;
    }
    RequestId: string;
    PhoneNumber: string;
}