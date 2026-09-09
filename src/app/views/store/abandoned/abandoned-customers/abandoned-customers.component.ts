import { Component, OnInit, ElementRef, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { CommonService } from '../../../../services/common.service';
import { ExcelService } from '../../../../services/excel.service';
import * as moment from 'moment-timezone';
import countryList from 'src/assets/json/country-list.json';

@Component({
    selector: 'app-abandoned-customers',
    templateUrl: './abandoned-customers.component.html',
    styleUrls: ['./abandoned-customers.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class AbandonedCustomersComponent implements OnInit, OnDestroy {

  @ViewChild('tableWrapper', { static: false }) tableWrapper!: ElementRef;
  @ViewChild('scrollIndicator', { static: false }) scrollIndicator!: ElementRef;

  @ViewChild('leftShadow', { static: false }) leftShadow!: ElementRef;
  @ViewChild('rightShadow', { static: false }) rightShadow!: ElementRef;

  page = 1; 
  pageSize = 10;
  filterForm: any = { search: "" }; 
  totalPages: number = 0;
  pagesList: any = []; 
  list: any = [];
  pageLoader: boolean = false;
  exportLoader: boolean = false;
  now = moment();
  
  // Enhanced scroll variables
  private isDragging = false;
  private isTouching = false;
  private startX = 0;
  private lastTouchX = 0;
  private scrollLeft = 0;
  private hasMoved = false;
  private dragThreshold = 5;
  private scrollIndicatorTimeout: any;
  private unlisteners: (() => void)[] = [];
  
  constructor(
    private customerApi: CustomerApiService, 
    public router: Router, 
    public commonService: CommonService,
    private excelService: ExcelService, 
    private datePipe: DatePipe,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.page = 1;
    if(this.commonService.page_attr && this.commonService.page_attr.type=='abandoned_customer') {
      let pageAttr = this.commonService.page_attr;
      this.page = pageAttr.page;
      this.filterForm.search = pageAttr.search;
      delete this.commonService.page_attr;
    }
    this.pageLoader = true;
    this.commonService.pageTop(0);
    this.onLoadData();
  }

  ngOnDestroy() {
    this.cleanupEventListeners();   
    if (this.scrollIndicatorTimeout) {
      clearTimeout(this.scrollIndicatorTimeout);
    }
  }


  private initializeEnhancedScrolling() {
    const wrapper = this.tableWrapper.nativeElement;

    this.updateShadows(wrapper);
    
    // Mouse events
    const mouseDownListener = this.renderer.listen(wrapper, 'mousedown', (e: MouseEvent) => {
      this.handleMouseDown(e, wrapper);
    });
    
    const mouseMoveListener = this.renderer.listen('document', 'mousemove', (e: MouseEvent) => {
      this.handleMouseMove(e, wrapper);
    });
    
    const mouseUpListener = this.renderer.listen('document', 'mouseup', (e: MouseEvent) => {
      this.handleMouseUp(e, wrapper);
    });

    // Touch events
    const touchStartListener = this.renderer.listen(wrapper, 'touchstart', (e: TouchEvent) => {
      this.handleTouchStart(e, wrapper);
    });
    
    const touchMoveListener = this.renderer.listen(wrapper, 'touchmove', (e: TouchEvent) => {
      this.handleTouchMove(e, wrapper);
    });
    
    const touchEndListener = this.renderer.listen(wrapper, 'touchend', (e: TouchEvent) => {
      this.handleTouchEnd(e, wrapper);
    });

    // Wheel scrolling
    const wheelListener = this.renderer.listen(wrapper, 'wheel', (e: WheelEvent) => {
      this.handleWheel(e, wrapper);
    });

    // Scroll events
    const scrollListener = this.renderer.listen(wrapper, 'scroll', () => {
      this.showScrollIndicator();      
      this.checkScrollability(wrapper);
        this.showInitialScrollHint(wrapper);
        this.updateShadows(wrapper);
    });

    // Prevent default drag
    const dragStartListener = this.renderer.listen(wrapper, 'dragstart', (e: Event) => {
      e.preventDefault();
    });

    // Click prevention during drag - Fixed: removed the 'true' parameter
    const clickListener = this.renderer.listen(wrapper, 'click', (e: MouseEvent) => {
      if (this.hasMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    // Store unlisteners for cleanup
    this.unlisteners.push(
      mouseDownListener, mouseMoveListener, mouseUpListener,
      touchStartListener, touchMoveListener, touchEndListener,
      wheelListener, scrollListener, dragStartListener, clickListener
    );

    // Initial setup
    this.checkScrollability(wrapper);
    this.showInitialScrollHint(wrapper);
  }

  private cleanupEventListeners() {
    this.unlisteners.forEach(unlisten => unlisten());
    this.unlisteners = [];
  }


  //shadow

  private updateShadows(wrapper: HTMLElement) {
  if (!this.leftShadow || !this.rightShadow) return;

  const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;

  if (wrapper.scrollLeft > 0) {
    this.renderer.addClass(this.leftShadow.nativeElement, 'show');
  } else {
    this.renderer.removeClass(this.leftShadow.nativeElement, 'show');
  }

  if (wrapper.scrollLeft < maxScrollLeft - 1) {
    this.renderer.addClass(this.rightShadow.nativeElement, 'show');
  } else {
    this.renderer.removeClass(this.rightShadow.nativeElement, 'show');
  }
}



  private isInteractiveElement(element: HTMLElement): boolean {
    const interactiveTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
    const interactiveClasses = [
      'dropdown-toggle', 'dropdown-item', 'btn', 'iconbutton', 
      'link-button', 'light-button2', 'dropdown'
    ];
    
    let current = element;
    while (current && current !== this.tableWrapper?.nativeElement) {
      if (interactiveTags.includes(current.tagName)) return true;
      
      if (interactiveClasses.some(cls => current.classList?.contains(cls))) return true;
      
      if (current.getAttribute('ngbDropdownToggle') !== null ||
          current.getAttribute('routerLink') !== null ||
          current.closest('button') !== null ||
          current.closest('a') !== null ||
          current.closest('.dropdown') !== null) {
        return true;
      }
      
      current = current.parentElement as HTMLElement;
    }
    
    return false;
  }

  private handleMouseDown(e: MouseEvent, wrapper: HTMLElement) {
    if (this.isInteractiveElement(e.target as HTMLElement)) return;
    
    this.isDragging = true;
    this.hasMoved = false;
    this.startX = e.pageX - wrapper.offsetLeft;
    this.scrollLeft = wrapper.scrollLeft;
    
    this.renderer.addClass(wrapper, 'dragging');
    this.renderer.setStyle(wrapper, 'cursor', 'grabbing');
    
    e.preventDefault();
    e.stopPropagation();
  }

  private handleMouseMove(e: MouseEvent, wrapper: HTMLElement) {
    if (!this.isDragging) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const x = e.pageX - wrapper.offsetLeft;
    const walkDistance = Math.abs(x - this.startX);
    
    if (walkDistance > this.dragThreshold) {
      this.hasMoved = true;
    }
    
    const walk = (x - this.startX) * 1.5;
    wrapper.scrollLeft = this.scrollLeft - walk;
  }

  private handleMouseUp(e: MouseEvent, wrapper: HTMLElement) {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.renderer.removeClass(wrapper, 'dragging');
    this.renderer.setStyle(wrapper, 'cursor', 'grab');
    
    if (this.hasMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setTimeout(() => {
      this.hasMoved = false;
    }, 100);
  }

  private handleTouchStart(e: TouchEvent, wrapper: HTMLElement) {
    if (this.isInteractiveElement(e.target as HTMLElement)) return;
    
    this.isTouching = true;
    this.hasMoved = false;
    this.lastTouchX = e.touches[0].pageX;
    this.scrollLeft = wrapper.scrollLeft;
  }

  private handleTouchMove(e: TouchEvent, wrapper: HTMLElement) {
    if (!this.isTouching) return;
    
    const currentTouchX = e.touches[0].pageX;
    const deltaX = this.lastTouchX - currentTouchX;
    
    if (Math.abs(deltaX) > this.dragThreshold) {
      this.hasMoved = true;
      e.preventDefault();
    }
    
    wrapper.scrollLeft = this.scrollLeft + deltaX;
  }

  private handleTouchEnd(e: TouchEvent, wrapper: HTMLElement) {
    this.isTouching = false;
    
    setTimeout(() => {
      this.hasMoved = false;
    }, 100);
  }

  private handleWheel(e: WheelEvent, wrapper: HTMLElement) {
    // Enable horizontal scrolling with wheel
    if (e.deltaX === 0 && e.deltaY !== 0) {
      e.preventDefault();
      wrapper.scrollLeft += e.deltaY * 0.5;
      this.showScrollIndicator();
    }
  }

  private checkScrollability(wrapper: HTMLElement) {
    const hasScroll = wrapper.scrollWidth > wrapper.clientWidth;
    if (hasScroll) {
      this.renderer.setStyle(wrapper, 'cursor', 'grab');
    }
  }

  private showInitialScrollHint(wrapper: HTMLElement) {
    if (wrapper.scrollWidth > wrapper.clientWidth) {
      this.showScrollIndicator();
      setTimeout(() => this.hideScrollIndicator(), 3000);
    }
  }

  private showScrollIndicator() {
    if (!this.scrollIndicator?.nativeElement) return;
    
    this.renderer.addClass(this.scrollIndicator.nativeElement, 'show');
    
    if (this.scrollIndicatorTimeout) {
      clearTimeout(this.scrollIndicatorTimeout);
    }
    
    this.scrollIndicatorTimeout = setTimeout(() => {
      this.hideScrollIndicator();
    }, 2000);
  }

  private hideScrollIndicator() {
    if (!this.scrollIndicator?.nativeElement) return;
    this.renderer.removeClass(this.scrollIndicator.nativeElement, 'show');
  }

  // Your existing methods remain the same
  onLoadData() {
    this.filterForm.skip = (this.page-1)*this.pageSize; 
    this.filterForm.limit = this.pageSize;
    
    this.customerApi.ABANDONED_CARTS(this.filterForm).subscribe(result => {
      
      // Initialize empty array first to prevent ngFor errors
      this.list = [];
      
      if(result.status && result.list && Array.isArray(result.list)) {
        // Clone the array to prevent reference issues
        this.list = [...result.list];
        
        // Process each item safely
        this.list.forEach((element, index) => {
          try {
            // Initialize all properties to prevent undefined errors
            element.mobile = element.mobile || '';
            element.name = element.name || `Customer ${index + 1}`;
            element.email = element.email || '';
            element.city = "-"; 
            element.country = "-"; 
            element.local_time = "-";
            element.reach_out = "-";
            element.cart_list = element.cart_list || [];
            element.address_list = element.address_list || [];
            
            // Process mobile number
            if(element.mobile) {
              if(element.mobile.charAt(0) === '0') element.mobile = element.mobile.substring(1);
              if(element.dial_code) element.mobile = element.dial_code+" "+element.mobile;
            }
            else element.mobile = "-";
            
            // Process address information
            if(element.address_list?.length) {
              element.city = element.address_list[0].city || "-";
              element.country = element.address_list[0].country || "-";
              const cDetails = countryList.find((el) => el.name == element.country);
              if(cDetails?.tz) {
                try {
                  element.local_time = this.now.tz(cDetails.tz).format('hh:mm A');
                  element.railway_time = this.now.tz(cDetails.tz).format('HH:mm');
                  element.reach_out = this.checkBestTime(element.railway_time);
                } catch (timeError) {
                  console.warn('Time processing error for item', index, timeError);
                  element.local_time = "-";
                  element.reach_out = "-";
                }
              }
            }
            
            // Calculate cart total safely
            element.cart_total = this.calcCartTotal(element.cart_list);
            
            // Add unique identifier if missing
            if (!element._id) {
              element._id = `temp_${index}_${Date.now()}`;
            }

            let trimmedMobile = element.mobile.replace(/\s+/g, "");
            let firstName = element.name.split(" ")[0];

            element.reach_out_link = this.getReachOutLink(trimmedMobile, firstName);
            element.follow_up_link = this.getFollowupLink(trimmedMobile, firstName);
            
          } catch (itemError) {
            console.error('Error processing item at index', index, itemError);
            // Remove problematic item
            this.list.splice(index, 1);
          }
        });
        
        this.totalPages = Math.ceil(result.count/this.pageSize);
        this.pagesList = new Array(this.totalPages);
      }
      else {
        console.log("API Error response or no data:", result);
        this.list = []; // Ensure empty array
        this.totalPages = 0;
        this.pagesList = [];
      }
      
      setTimeout(() => { 
        this.pageLoader = false;         
        
        // Initialize scrolling after data loads and view updates
        setTimeout(() => {
          if (this.tableWrapper && this.list && this.list.length && this.commonService.desktop_device) {
            this.initializeEnhancedScrolling();
          }
        }, 100);
      }, 500);
    });
  }

  checkBestTime(timeString: string) {
    if (!timeString) return "";

    try {
      const time = new Date(`1970-01-01T${timeString}:00`);
      if (isNaN(time.getTime())) return "Invalid Time";

      const hours = time.getHours();
      const minutes = time.getMinutes();
      const totalMinutes = hours * 60 + minutes;

      const ranges = [
        [10 * 60 + 30, 12 * 60],     // 10:30 - 12:00
        [14 * 60 + 30, 16 * 60 + 30],// 14:30 - 16:30
        [20 * 60, 21 * 60 + 30]      // 20:00 - 21:30
      ];

      const isBest = ranges.some(([start, end]) => totalMinutes >= start && totalMinutes < end);
      return isBest ? "This is Best Time" : "Avoid for Now";
    } catch (e) {
      return "Invalid Time";
    }
  }

  onChangePage(type: string) {
    this.commonService.pageTop(0);
    if(type=='prev') this.page--;
    else this.page++;
    this.onLoadData();
  }

  calcCartTotal(itemList: any[]) {
    if (!itemList || !Array.isArray(itemList)) {
      return 0;
    }
    return itemList.reduce((accumulator, currentValue) => {
      const finalPrice = currentValue['final_price'] || 0;
      const quantity = currentValue['quantity'] || 0;
      return accumulator + (finalPrice * quantity);
    }, 0);
  }

  // TrackBy function for ngFor to prevent index errors
  trackByFn(index: number, item: any): any {
    return item._id || index;
  }

  // TrackBy function for pagination
  trackByPageFn(index: number, item: any): number {
    return index;
  }

  catchPageData() {
    this.commonService.page_attr = {
      type: 'abandoned_customer', 
      page: this.page, 
      search: this.filterForm.search,
      scroll_pos: this.commonService.scroll_y_pos
    };
  }

  exportAsXLSX() {
    this.exportLoader = true;
    let fileName = 'customer-abandoned-cart'+' export '+new Date().getTime();
    
    this.customerApi.ALL_ABANDONED_CARTS().subscribe(result => {
      if(result.status) {
        let customerList = result.list;
        customerList.forEach((element, index) => {
          if(element.mobile) {
            if(element.mobile.charAt(0) === '0') element.mobile = element.mobile.substring(1);
            if(element.dial_code) element.mobile = element.dial_code+" "+element.mobile;
          }
          else element.mobile = "-";
          element.city = "-"; 
          element.country = "-"; 
          element.local_time = "-";
          element.reach_out = "-";
          if(element.address_list?.length) {
            element.city = element.address_list[0].city || "-";
            element.country = element.address_list[0].country || "-";
            const cDetails = countryList.find((el) => el.name == element.country);
            if(cDetails?.tz) {
              try {
                element.local_time = this.now.tz(cDetails.tz).format('hh:mm A');
                element.railway_time = this.now.tz(cDetails.tz).format('HH:mm');
                element.reach_out = this.checkBestTime(element.railway_time);
              } catch (timeError) {
                console.warn('Time processing error for item', index, timeError);
                element.local_time = "-";
                element.reach_out = "-";
              }
            }
          }
        });
        
        this.createList(customerList).then((exportList: any[]) => {
          this.excelService.exportAsExcelFile(exportList, fileName);
          setTimeout(() => { this.exportLoader = false; }, 500);
        });
      }
      else console.log("response", result);
    });
  }
  
  async createList(productList: any[]) {
    let updatedList = [];
    for(let prod of productList) {
      let sendData: any = {};
      sendData['Name'] = prod.name;
      sendData['First Name'] = prod.name.split(" ")[0];
      sendData['Email ID'] = prod.email;
      sendData['Phone Number'] = prod.mobile;
      sendData['Trimmed Phone Number'] = prod.mobile.replace(/\s+/g, "");
      sendData['Last Active Date'] = this.datePipe.transform(prod.cart_updated_on, 'dd MMM y hh:mm a');
      sendData['Cart Items'] = prod.cart_list.length;
      sendData['Cart Total'] = this.calcCartTotal(prod.cart_list);
      sendData['City'] = prod.city;
      sendData['Country'] = prod.country;
      sendData['Local Time'] = prod.local_time;
      sendData['Reach Out'] = prod.reach_out;
      sendData['Reach Out WhatsApp Link'] = this.getReachOutLink(sendData['Trimmed Phone Number'], sendData['First Name']);
      sendData['Follow Up WhatsApp Link'] = this.getFollowupLink(sendData['Trimmed Phone Number'], sendData['First Name']);
      updatedList.push(sendData);
    }
    return updatedList;
  }

  getReachOutLink(mobile: string, customerName: string) {
    if(mobile=='-') return mobile;
    else return `https://wa.me/${mobile}?text=Hi%20${customerName},%0a%0aWe%20noticed%20that%20you%20intended%20to%20place%20an%20order%20on%20our%20website%20which%20was%20interrupted%20or%20was%20not%20placed%20for%20reason%20unknown.%20How%20can%20we%20help%20you%20with%20your%20order?%0a%0aRegards,%0aTeam%20${this.commonService.store_details?.name}`;
  }
  getFollowupLink(mobile: string, customerName: string) {
    if(mobile=='-') return mobile;
    else return `https://wa.me/${mobile}?text=Hi%20${customerName},%0a%0aJust%20checking%20in%20again.%20Hope%20you%27re%20having%20a%20lovely%20day.%0ALet%20me%20know%20whenever%20you%27re%20free%20to%20chat.%20I%27d%20love%20to%20connect%20and%20share%20something%20special%20from%20${this.commonService.store_details?.name}`;
  }

}