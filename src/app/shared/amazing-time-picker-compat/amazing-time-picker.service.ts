import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AmazingTimePickerService {
    open(config?: any): { afterClose: () => Subject<string> } {
        const subject = new Subject<string>();
        // Use browser's native time input via prompt
        setTimeout(() => {
            const currentTime = config?.time || '12:00';
            const result = prompt('Select Time (HH:MM format, 24hr):', currentTime);
            if (result) {
                subject.next(result);
                subject.complete();
            }
        }, 100);
        return { afterClose: () => subject };
    }
}
