import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({providedIn: 'root'})
export class UserInterfaceService {
    private moreInfoShown: BehaviorSubject<boolean>;

    constructor() {
        this.moreInfoShown = new BehaviorSubject<boolean>(false);
    }

    isMoreInfoShown(): boolean {
        return this.moreInfoShown.getValue();
    }

    onToggleDisplayInfo() {
        this.moreInfoShown.next(!this.moreInfoShown.getValue());
        console.log(this.moreInfoShown.getValue());
    }

}
