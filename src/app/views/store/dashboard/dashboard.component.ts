import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Share } from '@capacitor/share';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { StoreApiService } from '../../../services/store-api.service';
import { CommonService } from '../../../services/common.service';
import { environment } from 'src/environments/environment';
declare const Notification: any;
declare var $;

import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTitleSubtitle, ApexStroke, ApexGrid } from "ng-apexcharts";
export type ChartOptions = {
  series: ApexAxisChartSeries; chart: ApexChart; xaxis: ApexXAxis;
  dataLabels: ApexDataLabels; grid: ApexGrid; stroke: ApexStroke; title: ApexTitleSubtitle;
};

@Component({
	selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  public chartOptions: any;
  public piechartOptions: any;
  pieChartStatus: boolean;
  share : any; discAmount: number;
  dashType: string = "order";
  deployInProgress: boolean;

  preLoader: boolean; customerLoader: boolean;
  order_details: any; customer_details: any;
	chartPie: any; chartLine: any; filterForm: any;
  completedPercentage: any; baseUrl: string;
  dispDashboard: boolean; infoConfig: any;
  tipsList : any = [
    {
      heading: "Increase sales",
      sub_heading: "Adding a custom domain, android app etc",
      description: "Increase your conversion rates and sales by adding custom domains, android app, and other plugins to your store.",
      tips_expand : false,
      bdr_bottom : true
    },
    {
      heading: "Improve customer experience",
      sub_heading: "Faster shipping and quick customer response...",
      description: "Improve your customer service, ship your orders faster with our logistic integrations readily available and get more orders from your customers.",
      tips_expand : false,
      bdr_bottom : true
    },
    {
      heading: "Increase customer trust",
      sub_heading: "Social proof and testimonials can increase...",
      description: "It's been proven that customer testimonials influence how much others are willing to trust a company. Get the word out about what customers are saying about your #product or #brand, using our clever social posts.",
      tips_expand : false,
      bdr_bottom : false
    }
  ];
  deployList: any = [
    {
      keyword: "account",
      heading: "Create your account", sub_heading: "",
      description: "",
      duration: "1", completed: true, redirect: "/account/profile"
    },
    {
      keyword: "logo", heading: "Add your logo",
      sub_heading: "",
      description: "Create or add a logo for your website",
      duration: "1", completed: false, redirect: "/setting/store/logo-management"
    },
    {
      keyword: "config", heading: "Setup B2B Configuration",
      sub_heading: "Settings → B2B Configuration",
      description: "Define website checkout experience for your users",
      duration: "1", completed: false, redirect: "/setting/store-config"
    },
    {
      keyword: "vendors", heading: "Add Vendors",
      sub_heading: "Vendors → Manage Vendors",
      description: "Add new vendors to your marketplace",
      duration: "1", completed: false, redirect: "/vendors/list"
    },
    {
      keyword: "products", heading: "List your products",
      sub_heading: "Products → All Products",
      description: "Add products to your website and start selling",
      duration: "1", completed: false, redirect: "/product-sections/products"
    },
    {
      keyword: "shipping", heading: "Setup shipping methods",
      sub_heading: "Settings → Shipping Methods",
      description: "Select shipping options available to customers at checkout",
      duration: "1", completed: false, redirect: "/setting/shipping-methods"
    },
    {
      keyword: "payments", heading: "Configure payment collection",
      sub_heading: "Settings → Payment Gateway",
      description: "Choose how people pay at checkout, including credit and debit cards, UPI, cash and more",
      duration: "1", completed: false, redirect: "/setting/payment-gateway"
    },
    {
      keyword: "package", heading: "Choose plan",
      sub_heading: "",
      description: "Choose the right plan for your business",
      duration: "1", completed: false, redirect: "/deployment/plans"
    }
  ];
  moreDeployList: any = [
    {
      keyword: "home_layouts", heading: "Design your website",
      sub_heading: "Website → Website Design",
      description: "Choose a template and add layouts to your website",
      duration: "5", completed: false, redirect: "/setup/layouts/home"
    },
    {
      keyword: "domain", heading: "Setup your domain",
      sub_heading: "",
      description: "Choose your domain or add your domain for your website",
      duration: "5", completed: false, redirect: "/setting/domain"
    },
    {
      keyword: "tax_rates", heading: "Add your taxation",
      sub_heading: "Settings → Tax Rates",
      description: "Create tax rates based on state laws",
      duration: "1", completed: false, redirect: "/setting/tax-rates"
    },
    {
      keyword: "social_media", heading: "Social Media",
      sub_heading: "Website → Footer Configuration",
      description: "Add your social media handles to your website",
      duration: "1", completed: false, redirect: "/setup/footer-content"
    },
    {
      keyword: "store_seo", heading: "Store SEO",
      sub_heading: "Website → SEO → Store",
      description: "Provide clear data about your website to organically rank better in google",
      duration: "1", completed: false, redirect: "/setup/seo/store"
    },
    {
      keyword: "discount", heading: "Discounts",
      sub_heading: "Marketing Tools → Offers",
      description: "Create offers to attract more buyers to your website",
      duration: "1", completed: false, redirect: "/setting/coupon-codes"
    },
    {
      keyword: "policy_builder", heading: "Policies",
      sub_heading: "",
      description: "Update our default policy to what best suits your business",
      duration: "1", completed: false, redirect: "/setup/policies"
    }
  ];
  whats_new_list: any = {
    1: {
      date: "26 Aug 2022",
      steps: [
        {
          title: "We’ve got a new look!",
          description: "Enjoy Yourstore’s new look that’s more streamlined and easier to use.",
          // badge: "New"
        },
        {
          title: "Improved Android App",
          description: "We’ve just launched our new and improved Android app.⁣⁣ Download it now on the Play Store.",
          // badge: "New"
        },
        {
          title: "Introducing iOS App",
          description: "Our iOS app is now available. Download it now on the App Store.",
          badge: "New"
        },
        {
          title: "DHL Integration",
          description: "We’re excited that you’ll be able to save time handling your international orders.",
          badge: "New"
        },
        {
          title: "Stripe Integration",
          description: "With Stripe’s integration, you can now accept payments from your customers in over 130 currencies.",
          badge: "New"
        },
        {
          title: "Delhivery Integration",
          description: "We now offer on-demand delivery service through India’s largest last mile delivery network.",
          // badge: "New"
        },
        {
          title: "Multi Vendor Ecommerce",
          description: "Stop carrying inventory and start selling products from multiple vendors using our full-fledged ecommerce engine for marketplaces.",
          // badge: "New"
        },
        {
          title: "B2B Ecommerce",
          description: "Upgrade your B2B & Wholesale business for the ecommerce era with our bulk order and quote handling system.",
          // badge: "New"
        },
        {
          title: "Bulk Upload",
          description: "Upload your product data lightning fast with our easy to use bulk upload system.",
          badge: "Coming Soon"
        },
        {
          title: "BlueDart Integration",
          description: "Convenience, Speed, & Security!<br>Give your customers a convenient and seamless experience with fast deliveries.",
          badge: "Coming Soon"
        },
        {
          title: "Shiprocket Integration",
          description: "Equip your store with a one-stop-shop for multiple shipping and logistic partners.",
          badge: "Coming Soon"
        },
        {
          title: "Marketing Automation",
          description: "Empower your team with our self-regulating tool that can handles routine marketing tasks with minimal human interaction and simplify your marketing process.",
          badge: "Coming Soon"
        },
        {
          title: "Sales Automation",
          description: "Automating your sales pipelines with Yourstore will enable you to streamline your sales process from start by upselling and reselling to your customers.",
          badge: "Coming Soon"
        },
        {
          title: "Website Performance Boost",
          description: "Great things happen when your site and content work together seamlessly. Your website might be doing very well, but a little extra boost in performance can bring it to new heights!",
          badge: "Coming Soon"
        }
      ]
    },
    2: {
      date: "28 Aug 2021",
      steps: [
        {
          title: "Quick Checkout",
          description: "Share a link with pre-filled products to your customers on WhatsApp, Instagram and other channels."
        },
        {
          title: "Our New Identity",
          description: "A refreshing new logo and pleasing colour scheme."
        },
        {
          title: "SMS Validation for CoD",
          description: "Avoid fake orders through OTP-style validation for CoD orders."
        },
        {
          title: "Sound Notifications",
          description: "Get notified when new orders are placed."
        },
        {
          title: "yourstore PWA",
          description: "Access yourstore quickly by adding it to your home screen."
        }
      ]
    },
    3: {
      date: "16 Aug 2020",
      steps: [
        {
          title: "Colour Consistency",
          description: "Platform-wide vivid colour usage to bring in more consistency and hierarchy of buttons and elements for easy of use."
        },
        {
          title: "Language Consistency",
          description: "UI updated with clearer text and terminology for more coherent usage of the Platform."
        },
        {
          title: "More Control over yourstore",
          description: "Manage your Store Plugins and control Store Checkout settings in just a few clicks. Find this under 'Settings' in the Plugin Management tab."
        },
        {
          title: "Update Critical Information",
          description: "Pixel code, Google Analytics code, Store email and much more can now be updated in the '<span class='info-highlight'>Store Settings</span>' tab under '<span class='info-highlight'>Settings</span>'."
        },
        {
          title: "More Free Features coming your way",
          description: "Send WhatsApp messages, email or call abandoned cart customers directly, manage announcement bar content by yourself and we've thrown in a sale countdown timer for the announcement bar to usher in the urgency to complete a purchase from your customers."
        }
      ]
    },
    4: {
      date: "16 Aug 2019",
      steps: [
        {
          title: "Mobile Responsive and Optimised Backend",
          description: "Use all the features of the yourstore backend on your mobile. Manage orders, products, SEO & more on the fly."
        },
        {
          title: "Optimised UI",
          description: "UI Elements Design have been optimized for ease of use and understanding with clear definitions for each section."
        },
        {
          title: "Dark mode",
          description: "yourstore has just joined the dark mode party. Enjoy using yourstore even at night without straining your eyes with our enhanced dark UI."
        },
        {
          title: "Dashboard",
          description: "The new updated dashboard has all the right features for you to run and analyze your business in real-time."
        }
      ]
    }
  };
  whatsNewStep: number = 1;
  totalWhatsNewScreen: number = Object.keys(this.whats_new_list).length;
  promotions: any = []; imageBaseUrl: string = environment.img_baseurl;
  deviceType: string; discContent: string; vendorPage: number;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: ApiService, private router: Router,
    private storeApi: StoreApiService, private datepipe: DatePipe, public commonService: CommonService, private swPush: SwPush
  ) {
    config.backdrop = 'static'; config.keyboard = false;
    if(!localStorage.getItem("country_list")) {
      this.api.COUNTRIES_LIST().subscribe(result => {
        this.commonService.country_list = [];
        if(result.status) this.commonService.country_list = result.list;
        this.commonService.updateLocalData('country_list', this.commonService.country_list);
      });
    }
    this.baseUrl = this.commonService.store_details.base_url.replace("https://", "");
    if(this.commonService.ios) this.deviceType = "ios";
    else if(this.commonService.desktop_device) this.deviceType = "web";
    else this.deviceType = "android";
  }

  ngOnInit() {
    this.commonService.pageTop(0);
    sessionStorage.removeItem("rfd");
    if(this.commonService.store_details?.type=='quot_based') {
      this.dashType = this.commonService.store_details.sub_type;
      if(this.dashType!='order') {
        let sInd = this.deployList.findIndex(el => el.keyword=='shipping');
        if(sInd!=-1) this.deployList.splice(sInd, 1);
      }
      if(this.dashType=='enquiry') {
        let pInd = this.deployList.findIndex(el => el.keyword=='payments');
        if(pInd!=-1) this.deployList.splice(pInd, 1);
      }
    }
    else {
      let dInd = this.deployList.findIndex(el => el.keyword=='config');
      if(dInd!=-1) this.deployList.splice(dInd, 1);
    }
    if(this.commonService.store_details?.type=='multi_vendor') {
      let dInd = this.deployList.findIndex(el => el.keyword=='products');
      if(dInd!=-1) {
        this.deployList[dInd].heading = "List vendor products";
        this.deployList[dInd].description = "Add your vendor products to your marketplace";
      }
    }
    else {
      let dInd = this.deployList.findIndex(el => el.keyword=='vendors');
      if(dInd!=-1) this.deployList.splice(dInd, 1);
    }
    if(this.commonService.store_details?.type=='estates') {
      this.dashType = 'enquiry';
      let sInd = this.deployList.findIndex(el => el.keyword=='shipping');
      if(sInd!=-1) this.deployList.splice(sInd, 1);
      let pInd = this.deployList.findIndex(el => el.keyword=='payments');
      if(pInd!=-1) this.deployList.splice(pInd, 1);
    }
    // deploy stages
    this.updateDeployInfo();
    if(this.commonService.store_details.login_type=='admin' || this.commonService.subuser_features.indexOf('dashboard')!=-1) {
      // dashboard
      this.filterForm = { type: 'today', from_date: new Date(), to_date: new Date() };
      this.dispDashboard = true;
      this.getDashboardData();
    }
    $(function() {
      $('.chart').easyPieChart({
        size: 120,
        barColor: "#E0717B",
        scaleLength: 0,
        lineWidth: 8,
        trackColor: "#e0717b1a",
        lineCap: "circle",
        animate: 1000,
      });
    });
	}

  ngAfterViewInit() {
    if(!environment.keep_login && !this.commonService.ios && !sessionStorage.getItem('blockSub') && !this.commonService.master_token && this.commonService.store_details.login_type=='admin' && this.swPush.isEnabled) {
      if(Notification.permission=='default') { document.getElementById('openSubModal')?.click(); }
      else if(Notification.permission=='granted' && !sessionStorage.getItem("sw_sub")) { this.reqSub(); }
    }
    setTimeout(() => {
      if(this.commonService.store_details?.login_type=='admin' && this.commonService.store_details?.package_info?.category=='pro' && this.commonService.store_details?.signup_by=='self' && !this.commonService.store_details?.package_details.billing_status) {
        let diffDays = this.dateDiff(new Date(), this.commonService.store_details?.package_details.trial_expiry);
        if(diffDays<1) diffDays = 1;
        this.discAmount = (this.commonService.store_details?.package_info?.pricing['1']?.amount * 0.1);
        this.discContent = "Enjoy 7 days free trial";
        let dayType = "days";
        if(diffDays===1) dayType = "day";
        if(diffDays<7) this.discContent = "You have "+diffDays+" "+dayType+" of free trial left";
        document.getElementById('openDiscModal')?.click();
      }
    }, 1000);
    // chat
    if(environment.enable_chat && this.commonService.store_details?.login_type!='vendor') {
      this.commonService.dispChatIcon = true;
    }
  }

  dateDiff(date1, date2) {
    let diffDays = 0;
    date1 = new Date(new Date(date1).setHours(0,0,0,0));
    date2 = new Date(new Date(date2).setHours(23,59,59,59));
    if(date2 > date1) {
      let diffTime = Math.abs(date2 - date1);
      diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return diffDays;
  }

  routeChange() {
    sessionStorage.setItem("rfd", "true");
  }

  updateDeployInfo() {
    let completedCount = 0;
    this.deployList.forEach(element => {
      if(element.keyword=='logo') {
        if(this.commonService.deploy_stages.logo && this.commonService.deploy_details?.theme_colors?.primary) {
          element.completed = true;
          completedCount++;
        }
      }
      else {
        if(this.commonService.deploy_stages[element.keyword] || element.completed) {
          element.completed = true;
          completedCount++;
        }
      }
    });
    this.deployInProgress = true;
    if(completedCount===this.deployList.length) this.deployInProgress = false;
    this.completedPercentage = parseFloat(((completedCount*100)/this.deployList.length).toFixed(1));
  }

  getDashboardData() {
    this.vendorPage = 1;
    this.pieChartStatus = false;
    if(this.filterForm.dates?.length > 1) {
      this.filterForm.from_date = this.filterForm.dates[0];
      this.filterForm.to_date = this.filterForm.dates[1];
    }
    if(this.filterForm.from_date && this.filterForm.to_date && new Date(this.filterForm.to_date) >= new Date(this.filterForm.from_date)) {
      this.filterForm.from_date = new Date(new Date(this.filterForm.from_date).setHours(0,0,0,0));
      this.filterForm.to_date = new Date(new Date(this.filterForm.to_date).setHours(23,59,59,999));
      this.preLoader = true;

      this.order_details = {
        products: 0, order_list: [], gc_list: [], total_sales: 0, placed_orders: 0, confirmed_orders: 0,
        dispatched_orders: 0, completed_orders: 0, cancelled_orders: 0, pending_orders: 0, gc_total_sales: 0,
        total_revenue: 0, quot_list: [], net_sales: 0, processing_orders: 0, quot_orders: 0, enq_list: [],
        new_enqs: 0, contacted_enqs: 0, vendor_list: []
      };
      // DASHBOARD
      let formData: any = { from_date: this.filterForm.from_date, to_date: this.filterForm.to_date, sub_type: this.dashType };
      if(localStorage.getItem("master_token")) formData.master_login = true;
      this.storeApi.DASHBOARD(formData).subscribe(result => {
        setTimeout(() => { this.preLoader = false; }, 500);
        if(result.status) {
          this.commonService.vendor_list.filter(el => el.status=='active').forEach(ven => {
            let filOrders = result.data.order_list.filter(ol => ol.vendor_list.filter(xy => xy.vendor_id==ven._id).length);
            if(filOrders.length) {
              let orderAmt = filOrders.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.vendor_list.filter(xy => xy.vendor_id==ven._id)[0]?.final_price;
              }, 0);
              this.order_details.vendor_list.push({ _id: ven._id, name: ven.company_details?.brand, orders: filOrders.length, value: orderAmt })
            }
          });
          this.promotions = result.promotions.filter(el => el.device_type.indexOf('all')!=-1 || el.device_type.indexOf(this.deviceType)!=-1);
          this.order_details.products = result.data.products;
          // orders
          this.order_details.order_list = result.data.order_list;
          this.order_details.order_list.forEach(element => {
            this.order_details.total_sales += element.final_price;
            if(element.order_status!='cancelled') this.order_details.total_revenue += element.final_price;
            // orders count
            if(element.order_status=='placed') this.order_details.placed_orders++;
            if(element.order_status=='confirmed') this.order_details.confirmed_orders++;
            if(element.order_status=='dispatched') this.order_details.dispatched_orders++;
            if(element.order_status=='delivered') this.order_details.completed_orders++;
            if(element.order_status=='cancelled') this.order_details.cancelled_orders++;
          });
          this.order_details.pending_orders = result.data.order_list.filter(el => !el.payment_success).length;
          // gc orders
          this.order_details.gc_list = result.data.gc_list;
          this.order_details.gc_total_sales = this.order_details.gc_list.reduce((accumulator, currentValue) => {
            return accumulator + currentValue['price'];
          }, 0);
          // quotes
          this.order_details.quot_orders = result.data.quot_orders;
          this.order_details.net_sales = result.data.net_sales;
          this.order_details.quot_list = result.data.quot_list;
          this.order_details.quot_list.forEach(element => {
            this.order_details.total_sales += element.final_price;
            // orders count
            if(element.quot_status=='placed') this.order_details.placed_orders++;
            if(element.quot_status=='processing') this.order_details.processing_orders++;
            if(element.quot_status=='confirmed') this.order_details.confirmed_orders++;
            if(element.quot_status=='cancelled') this.order_details.cancelled_orders++;
          });
          // enquiries
          this.order_details.enq_list = result.data.enq_list;
          this.order_details.new_enqs = result.data.enq_list.filter(el => el.status=='new').length;
          this.order_details.contacted_enqs = result.data.enq_list.filter(el => el.status=='contacted').length;
          // line chart
          let dataList = this.order_details.order_list; let lineName = "Orders";
          if(this.order_details.quot_list.length) {
            lineName = "Quotes";
            dataList = this.order_details.quot_list;
          }
          if(this.order_details.enq_list.length) {
            lineName = "Enquires";
            dataList = this.order_details.enq_list;
          }
          this.buildLineChart(dataList).then((chartData) => {
            this.chartOptions = {
              series: [{ name: lineName, data: chartData.orders }],
              chart: { type: "area", height: 350, width: '100%', toolbar: { show: false }, zoom: { zoomedArea: { fill: { color: 'rgba(118,109,219,255)', opacity: 0.3 } } } },
              plotOptions: {}, legend: { show: false }, dataLabels: { enabled: false },
              fill: { type: "gradient", colors: ["rgba(118,109,219,255)"], gradient: { shadeIntensity: 1, opacityFrom: 0, opacityTo: 0.2, stops: [0, 70, 100] } },
              stroke: { curve: "smooth", show: true, width: 3, colors: ["rgba(118,109,219,255)"] },
              xaxis: { categories: chartData.days,  axisBorder: { show: false, color: "red"},  axisTicks: { show: false }, tickAmount: 6,
                labels: { show: false, rotate: 0, rotateAlways: !0, style: { colors: "green", fontSize: "12px" } },
                crosshairs: { position: "front", stroke: { color: 'rgba(118,109,219,255)', width: 1.5, dashArray: 3 } },
                tooltip: { enabled: false, formatter: void 0, offsetY: 0, style: { fontSize: "12px" } },
              },
              yaxis: { min: 0, labels:{formatter: function(val) { return val.toFixed(0) }, style: { colors: "#9f9f9f", fontSize: "12px" } } },
              states: { normal: { filter: { type: "none", value: 0 } }, hover: { filter: { type: "none", value: 0 } }, active: { allowMultipleDataPointsSelection: !1, filter: { type: "none", value: 0 } } },
              tooltip: {
                style: { fontSize: "12px" },
                x:{ background: "rgba(118,109,219,255)" },
                y: { formatter: function(val) { return val } }
              },
              colors: ["rgba(118,109,219,255)"],
              grid: { borderColor: '#E4E6EF', strokeDashArray: 4, width: 1, yaxis: { lines: { show: true } } },
              markers: { strokeColor: "rgba(118,109,219,255)", strokeWidth: 3 },
            };
          });
          // pie chart
          if(this.order_details.order_list.length || this.order_details.quot_list.length || this.order_details.enq_list.length) { 
            this.pieChartStatus = true;
            let seriesData = []; let labelData = []; let colorData = [];
            if(this.order_details.order_list.length) {
              seriesData = [
                this.order_details.placed_orders, this.order_details.confirmed_orders, this.order_details.dispatched_orders,
                this.order_details.completed_orders, this.order_details.pending_orders, this.order_details.cancelled_orders
              ];
              labelData = ["Placed", "Confirmed", "Dispatched", "Delivered", "Payment Pending", "Cancelled"];
              colorData = ['#008BF8cc', '#F5B700cc', '#766ddbcc', '#3CC596cc', '#f56725cc', '#F33B4Dcc'];
            }
            else if(this.order_details.quot_list.length) {
              seriesData = [
                this.order_details.placed_orders, this.order_details.processing_orders,
                this.order_details.confirmed_orders, this.order_details.cancelled_orders
              ];
              labelData = ["New", "Processing", "Confirmed", "Cancelled"];
              colorData = ['#008BF8cc', '#F5B700cc', '#3CC596cc', '#F33B4Dcc'];
            }
            else {
              seriesData = [this.order_details.new_enqs, this.order_details.contacted_enqs];
              labelData = ["New", "Contacted"];
              colorData = ['#008BF8cc', '#F5B700cc'];
            }
            this.piechartOptions = {
              series: seriesData,
              chart: { type: "donut", width: 400 },
              legend: { position: "right", textStyle: { color:'#d83967' }, fontSize: '12px' },
              labels: labelData,
              colors: colorData,
              dataLabels: {
                enabled: true, 
                style: {fontSize: '10px'}, 
                dropShadow: { enabled: false }
              },
              responsive: [{ breakpoint: 480 }]
            };
          }
        }
        else console.log("dashboard response", result);
      });
      // CUSTOMERS
      this.customerLoader = true;
      this.customer_details = { total_customers: 0, abandoned_count: 0, top_customers: [] };
      let fData: any = {
        from_date: this.filterForm.from_date, to_date: this.filterForm.to_date, limit: 4,
        ced: new Date(new Date().setHours(23,59,59,999)), cd: new Date(new Date().setHours(0,0,0,0)), sub_type: this.dashType
      };
      this.storeApi.DASHBOARD_CUSTOMERS(fData).subscribe(result => {
        setTimeout(() => { this.customerLoader = false; }, 500);
        if(result.status) {
          this.customer_details.total_customers = result.data.total_customers;
          this.customer_details.abandoned_count = result.data.abandoned_count;
          this.buildCustomerList(result.data.top_customers).then((respData) => {
            this.customer_details.top_customers = respData;
          });
        }
        else console.log("customer response", result);
      });
    }
  }

  onFilterChange(x) {
    this.filterForm.dates=[];
    if(x=='today') { this.filterForm.from_date = new Date; this.filterForm.to_date = new Date; }
    else if(x=='yesterday') { this.filterForm.from_date = new Date(new Date().setDate(new Date().getDate() - 1)); this.filterForm.to_date = new Date(new Date().setDate(new Date().getDate() - 1)); }
    else if(x=='last_7_days') { this.filterForm.from_date = new Date(new Date().setDate(new Date().getDate() - 7)); this.filterForm.to_date = new Date(new Date().setDate(new Date().getDate() - 1)); }
    else if(x=='last_30_days') { this.filterForm.from_date = new Date(new Date().setDate(new Date().getDate() - 30)); this.filterForm.to_date = new Date(new Date().setDate(new Date().getDate() - 1)); }
    else if(x=='current_month') { this.filterForm.from_date = new Date(new Date().getFullYear(), new Date().getMonth(), 1); this.filterForm.to_date = new Date; }
    else if(x=='last_month') {
      let prevMonth = new Date().setMonth(new Date().getMonth() - 1);
      this.filterForm.from_date = new Date(new Date(prevMonth).getFullYear(), new Date(prevMonth).getMonth(), 1);
      this.filterForm.to_date = new Date(new Date(prevMonth).getFullYear(), new Date(prevMonth).getMonth() + 1, 0);
    }
    else if(x=='current_year') { this.filterForm.from_date = new Date(new Date().getFullYear(), 0, 1); this.filterForm.to_date = new Date; }
    else if(x=='last_year') {
      let prevYear = new Date().setFullYear(new Date().getFullYear() - 1);
      this.filterForm.from_date = new Date(new Date(prevYear).getFullYear(), 0, 1);
      this.filterForm.to_date = new Date(new Date(prevYear).getFullYear(), 11, 31);
    }
    else if(x=='current_fin_year') {
      let currYear_FinYearEndDate = new Date(new Date().getFullYear(), 2, 31).setHours(23,59,59,999);
      if(new Date(currYear_FinYearEndDate) > new Date) {
        // fin year going to complete (on jan to march)
        let prevYear = new Date().setFullYear(new Date().getFullYear() - 1);
        this.filterForm.from_date = new Date(new Date(prevYear).getFullYear(), 3, 1);
        this.filterForm.to_date = new Date(new Date().getFullYear(), 2, 31);
        if(this.filterForm.to_date > new Date) this.filterForm.to_date = new Date;
      }
      else {
        // new fin year started (on apr to dec)
        let nextYear = new Date().setFullYear(new Date().getFullYear() + 1);
        this.filterForm.from_date = new Date(new Date().getFullYear(), 3, 1);
        this.filterForm.to_date = new Date(new Date(nextYear).getFullYear(), 2, 31);
        if(this.filterForm.to_date > new Date) this.filterForm.to_date = new Date;
      }
    }
    else if(x=='last_fin_year') {
      let currYear_FinYearEndDate = new Date(new Date().getFullYear(), 2, 31).setHours(23,59,59,999);
      if(new Date(currYear_FinYearEndDate) > new Date) {
        // fin year going to complete (on jan to march)
        let pastPrevYear = new Date().setFullYear(new Date().getFullYear() - 2);
        let prevYear = new Date().setFullYear(new Date().getFullYear() - 1);
        this.filterForm.from_date = new Date(new Date(pastPrevYear).getFullYear(), 3, 1);
        this.filterForm.to_date = new Date(new Date(prevYear).getFullYear(), 2, 31);
      }
      else {
        // new fin year started (on apr to dec)
        let prevYear = new Date().setFullYear(new Date().getFullYear() - 1);
        this.filterForm.from_date = new Date(new Date(prevYear).getFullYear(), 3, 1);
        this.filterForm.to_date = new Date(new Date().getFullYear(), 2, 31);
      }
    }
    else if(x=='all_time') { this.filterForm.from_date = new Date(this.commonService.store_details.created_on); this.filterForm.to_date = new Date; }
		this.getDashboardData();
  }
  
  async buildLineChart(orderList) {
    let diff = Math.abs(new Date(this.filterForm.from_date).getTime() - this.filterForm.to_date.getTime())+1;
    let diffDays = Math.ceil(diff / (1000*3600*24))-1;
    let dayList = []; let ordersCountList = [];
    if(diffDays > 0) {
      for(let i=0; i<=diffDays; i++)
      {
        let currDate = new Date(this.filterForm.to_date).setDate(new Date(this.filterForm.to_date).getDate() - (diffDays-i));
        let orderCount: any = await this.processOrderList(orderList, new Date(currDate).setHours(0,0,0,0), new Date(currDate).setHours(23,59,59,999));
        if(orderCount > 0) {
          dayList.push(this.datepipe.transform(new Date(currDate), 'dd MMM y'));
          ordersCountList.push(orderCount);
        }
      }
    }
    else {
      for(let i=0; i<=23; i++)
      {
        let orderCount: any = await this.processOrderList(orderList, new Date(this.filterForm.from_date).setHours(i,0,0,0), new Date(this.filterForm.from_date).setHours(i,59,59,999));
        if(orderCount > 0) {
          dayList.push(this.datepipe.transform(new Date(new Date(this.filterForm.from_date).setHours(i,0,0,0)), 'hh:mm a'));
          ordersCountList.push(orderCount);
        }
      }
    }
    return ({days: dayList, orders: ordersCountList});
  }

  processOrderList(orderList, fromDate, toDate) {
    return new Promise((resolve, reject) => {
      let count = orderList.filter(obj => new Date(obj.created_on) >= new Date(fromDate) && new Date(toDate) > new Date(obj.created_on)).length;
      resolve(count);
    });
  }
  
  async buildCustomerList(customerList) {
    let updatedCustomers = [];
    for(let i=0; i<customerList.length; i++)
    {
      let orderDetails: any = await this.processCustomerOrders(customerList[i].order_list);
      if(orderDetails.total_price > 0) {
        if(customerList[i].customerDetails?.length) {
          orderDetails.user_type = 'signup';
          orderDetails._id = customerList[i].customerDetails[0]._id;
          orderDetails.name = customerList[i].customerDetails[0].name;
          // orderDetails.email = customerList[i].customerDetails[0].email;
          updatedCustomers.push(orderDetails);
        }
        else if(customerList[i].guestDetails?.length) {
          orderDetails.user_type = 'guest';
          orderDetails._id = customerList[i].guestDetails[0]._id;
          orderDetails.name = customerList[i].guestDetails[0].address_list[0]?.name;
          // orderDetails.email = customerList[i].guestDetails[0].email;
          updatedCustomers.push(orderDetails);
        }
      }
    }
    return updatedCustomers;
  }

  processCustomerOrders(orderList) {
    return new Promise((resolve, reject) => {
      let orderDetails = { total_qty: 0, total_price: 0 };
      for(let i=0; i<orderList.length; i++)
      {
        orderDetails.total_price += orderList[i].final_price;
        orderDetails.total_qty += orderList[i].item_list.reduce((accumulator, currentValue) => {
          return accumulator + currentValue['quantity'];
        }, 0);
      }
      resolve(orderDetails);
    });
  }

  shareDomain(modalName, socialShareStatus) {
    if(this.commonService.deploy_stages.logo && this.commonService.deploy_details.theme_colors?.primary) {
      if(socialShareStatus) this.socialShare();
      else window.open(this.commonService.store_details.base_url, '_blank');
    }
    else {
      this.infoConfig = {
        content: "Please upload logo and theme colour in step 2 to view the website",
        btn_txt: "Upload Logo"
      };
      if(this.commonService.deploy_stages.logo) {
        this.infoConfig = {
          content: "Please set theme colour in step 2 to view the website",
          btn_txt: "Set Colour"
        };
      }
      this.modalService.open(modalName, { size: 'md', centered: true});
    }
  }

  socialShare() {
    if(environment.keep_login) {
      Share.share({
        title: '', text: '', dialogTitle: '',
        url: this.commonService.store_details.base_url
      });
    }
    else {
      if(!this.commonService.isDesktop) {
        let windowNav: any = window.navigator;
        if(windowNav && windowNav.share) {
          windowNav.share({
            title: '', text: '',
            url: this.commonService.store_details.base_url
          })
          .catch( (error) => { console.log(error); });
        }
        else console.log("share not supported")
      }
    }
  }

  onRedirect(x) {
    if(x && x.rd_status) {
      if(x.rd_type == 'internal') this.router.navigate([x.rd_to]);
      else if(x.rd_type == 'external') window.open(x.rd_to, "_blank");
    }
  }

  reqSub() {
    if(this.swPush.isEnabled) {
      this.swPush.requestSubscription({ serverPublicKey: this.commonService.vapidPublicKey })
      .then(sub => {
        sessionStorage.setItem("sw_sub","true");
        this.storeApi.STORE_UPDATE({ device_token: sub }).subscribe(result => {
          if(!result.status) console.log("response", result);
        });
      })
      .catch(err => console.error("Could not subscribe to notifications", err));
    }
  }
  blockSub() {
    sessionStorage.setItem('blockSub', 'true');
  }

}