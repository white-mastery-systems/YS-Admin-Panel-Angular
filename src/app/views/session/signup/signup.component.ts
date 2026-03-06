import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [SharedAnimations]
})

export class SignupComponent implements OnInit {

  signupForm: any; params: any; queryParams: any;
  step: number = 1; stateList: any = [];
  pageLoader: boolean; zohoLeadId: string; leadSource: String;
  currencyList: any = [
    {
      "country_code": "USD",
      "html_code": "&#36;"
    },
    {
      "country_code": "EUR",
      "html_code": "&#128;"
    },
    {
      "country_code": "AED",
      "html_code": "AED"
    },
    {
      "country_code": "ARS",
      "html_code": "ARS"
    },
    {
      "country_code": "AUD",
      "html_code": "A&#36;"
    },
    {
      "country_code": "BDT",
      "html_code": "BDT"
    },
    {
      "country_code": "BGN",
      "html_code": "BGN"
    },
    {
      "country_code": "BOB",
      "html_code": "BOB"
    },
    {
      "country_code": "BRL",
      "html_code": "R&#36;"
    },
    {
      "country_code": "BYN",
      "html_code": "BYN"
    },
    {
      "country_code": "CAD",
      "html_code": "CA&#36;"
    },
    {
      "country_code": "CHF",
      "html_code": "CHF"
    },
    {
      "country_code": "CLP",
      "html_code": "CLP"
    },
    {
      "country_code": "CNY",
      "html_code": "CN&#x00A5;"
    },
    {
      "country_code": "COP",
      "html_code": "COP"
    },
    {
      "country_code": "CZK",
      "html_code": "CZK"
    },
    {
      "country_code": "DKK",
      "html_code": "DKK"
    },
    {
      "country_code": "DOP",
      "html_code": "DOP"
    },
    {
      "country_code": "DZD",
      "html_code": "DZD"
    },
    {
      "country_code": "EGP",
      "html_code": "EGP"
    },
    {
      "country_code": "GBP",
      "html_code": "&#163;"
    },
    {
      "country_code": "GHS",
      "html_code": "GHS"
    },
    {
      "country_code": "GIP",
      "html_code": "GIP"
    },
    {
      "country_code": "HKD",
      "html_code": "HK&#36;"
    },
    {
      "country_code": "HRK",
      "html_code": "HRK"
    },
    {
      "country_code": "HUF",
      "html_code": "HUF"
    },
    {
      "country_code": "IDR",
      "html_code": "IDR"
    },
    {
      "country_code": "ILS",
      "html_code": "&#8362;"
    },
    {
      "country_code": "INR",
      "html_code": "&#x20B9;"
    },
    {
      "country_code": "JOD",
      "html_code": "JOD"
    },
    {
      "country_code": "JPY",
      "html_code": "&#165;"
    },
    {
      "country_code": "KES",
      "html_code": "KES"
    },
    {
      "country_code": "KWD",
      "html_code": "KWD"
    },
    {
      "country_code": "LBP",
      "html_code": "LBP"
    },
    {
      "country_code": "LKR",
      "html_code": "LKR"
    },
    {
      "country_code": "MAD",
      "html_code": "MAD"
    },
    {
      "country_code": "MDL",
      "html_code": "MDL"
    },
    {
      "country_code": "MXN",
      "html_code": "MX&#36;"
    },
    {
      "country_code": "MYR",
      "html_code": "MYR"
    },
    {
      "country_code": "NAD",
      "html_code": "NAD"
    },
    {
      "country_code": "NGN",
      "html_code": "&#8358;"
    },
    {
      "country_code": "NOK",
      "html_code": "NOK"
    },
    {
      "country_code": "NZD",
      "html_code": "NZ&#36;"
    },
    {
      "country_code": "OMR",
      "html_code": "OMR"
    },
    {
      "country_code": "PEN",
      "html_code": "PEN"
    },
    {
      "country_code": "PHP",
      "html_code": "PHP"
    },
    {
      "country_code": "PLN",
      "html_code": "PLN"
    },
    {
      "country_code": "PYG",
      "html_code": "PYG"
    },
    {
      "country_code": "QAR",
      "html_code": "QAR"
    },
    {
      "country_code": "RON",
      "html_code": "RON"
    },
    {
      "country_code": "RSD",
      "html_code": "RSD"
    },
    {
      "country_code": "RUB",
      "html_code": "RUB"
    },
    {
      "country_code": "SAR",
      "html_code": "SAR"
    },
    {
      "country_code": "SEK",
      "html_code": "SEK"
    },
    {
      "country_code": "SGD",
      "html_code": "SGD"
    },
    {
      "country_code": "THB",
      "html_code": "THB"
    },
    {
      "country_code": "TND",
      "html_code": "TND"
    },
    {
      "country_code": "TRY",
      "html_code": "TRY"
    },
    {
      "country_code": "TWD",
      "html_code": "NT&#36;"
    },
    {
      "country_code": "UAH",
      "html_code": "UAH"
    },
    {
      "country_code": "UYU",
      "html_code": "UYU"
    },
    {
      "country_code": "VND",
      "html_code": "&#8363;"
    },
    {
      "country_code": "ZAR",
      "html_code": "ZAR"
    },
    {
      "country_code": "PKR",
      "html_code": "PKR"
    }
  ];
  ipList: any = [
    {
      "currency_code": "USD",
      "country_list": [
        {
          "name": "Afghanistan",
          "code": "AFG"
        },
        {
          "name": "American Samoa",
          "code": "ASM"
        },
        {
          "name": "Angola",
          "code": "AGO"
        },
        {
          "name": "Antigua & Barbuda",
          "code": "ATG"
        },
        {
          "name": "Armenia",
          "code": "ARM"
        },
        {
          "name": "Bahamas",
          "code": "BHS"
        },
        {
          "name": "Barbados",
          "code": "BRB"
        },
        {
          "name": "Belize",
          "code": "BLZ"
        },
        {
          "name": "Bhutan",
          "code": "BTN"
        },
        {
          "name": "Bonaire",
          "code": "BES"
        },
        {
          "name": "Burundi",
          "code": "BDI"
        },
        {
          "name": "Cambodia",
          "code": "KHM"
        },
        {
          "name": "Cameroon",
          "code": "CMR"
        },
        {
          "name": "Cape Verde",
          "code": "CPV"
        },
        {
          "name": "Cayman Islands",
          "code": "CYM"
        },
        {
          "name": "Central African Rep.",
          "code": "CAF"
        },
        {
          "name": "Chad",
          "code": "TCD"
        },
        {
          "name": "Comoros",
          "code": "COM"
        },
        {
          "name": "Congo",
          "code": "COG"
        },
        {
          "name": "Costa Rica",
          "code": "CRI"
        },
        {
          "name": "Cote d'Ivoire",
          "code": "CIV"
        },
        {
          "name": "Cuba",
          "code": "CUB"
        },
        {
          "name": "Curacao",
          "code": "CUW"
        },
        {
          "name": "Democratic Rep. of Congo",
          "code": "COD"
        },
        {
          "name": "Djibouti",
          "code": "DJI"
        },
        {
          "name": "Dominica",
          "code": "DMA"
        },
        {
          "name": "Ecuador",
          "code": "ECU"
        },
        {
          "name": "El Salvador",
          "code": "SLV"
        },
        {
          "name": "Eritrea",
          "code": "ERI"
        },
        {
          "name": "Ethiopia",
          "code": "ETH"
        },
        {
          "name": "Falkland Islands",
          "code": "FLK"
        },
        {
          "name": "Faroe Islands",
          "code": "FRO"
        },
        {
          "name": "Federal States of Micronesia",
          "code": "FSM"
        },
        {
          "name": "Fiji",
          "code": "FJI"
        },
        {
          "name": "Gabon",
          "code": "GAB"
        },
        {
          "name": "Gambia",
          "code": "GMB"
        },
        {
          "name": "Georgia",
          "code": "GEO"
        },
        {
          "name": "Grenada",
          "code": "GRD"
        },
        {
          "name": "Guam",
          "code": "GUM"
        },
        {
          "name": "Guatemala",
          "code": "GTM"
        },
        {
          "name": "Guinea - Republic",
          "code": "GIN"
        },
        {
          "name": "Guinea-Bissau",
          "code": "GNB"
        },
        {
          "name": "Haiti",
          "code": "HTI"
        },
        {
          "name": "Holland",
          "code": "NL"
        },
        {
          "name": "Honduras",
          "code": "HND"
        },
        {
          "name": "Iran",
          "code": "IRN"
        },
        {
          "name": "Iraq",
          "code": "IRQ"
        },
        {
          "name": "Jamaica",
          "code": "JAM"
        },
        {
          "name": "Kiribati",
          "code": "KIR"
        },
        {
          "name": "Lao People's Democratic Republic",
          "code": "LAO"
        },
        {
          "name": "Lesotho",
          "code": "LSO"
        },
        {
          "name": "Libya",
          "code": "LBY"
        },
        {
          "name": "Macau",
          "code": "MAC"
        },
        {
          "name": "Madagascar",
          "code": "MDG"
        },
        {
          "name": "Malawi",
          "code": "MWI"
        },
        {
          "name": "Maldives",
          "code": "MDV"
        },
        {
          "name": "Mali",
          "code": "MLI"
        },
        {
          "name": "Marshall Islands",
          "code": "MHL"
        },
        {
          "name": "Mauritania",
          "code": "MRT"
        },
        {
          "name": "Mauritius",
          "code": "MUS"
        },
        {
          "name": "Myanmar",
          "code": "MMR"
        },
        {
          "name": "Nepal",
          "code": "NPL"
        },
        {
          "name": "Netherlands Antilles",
          "code": "ANT"
        },
        {
          "name": "New Caledonia",
          "code": "NCL"
        },
        {
          "name": "Nicaragua",
          "code": "NIC"
        },
        {
          "name": "Niger",
          "code": "NER"
        },
        {
          "name": "Palau",
          "code": "PLW"
        },
        {
          "name": "Panama",
          "code": "PAN"
        },
        {
          "name": "Papua New Guinea",
          "code": "PNG"
        },
        {
          "name": "Puerto Rico",
          "code": "PRI"
        },
        {
          "name": "Rep of (N Somalia) Somaliland",
          "code": "SOM"
        },
        {
          "name": "Republic of Korea",
          "code": "KOR"
        },
        {
          "name": "Republic of Macedonia",
          "code": "MKD"
        },
        {
          "name": "Republic of Nauru",
          "code": "NRU"
        },
        {
          "name": "Republic of Yemen",
          "code": "YEM"
        },
        {
          "name": "Rwanda",
          "code": "RWA"
        },
        {
          "name": "Saint Helena",
          "code": "SHN"
        },
        {
          "name": "Saipan",
          "code": "MNP"
        },
        {
          "name": "Samoa",
          "code": "WSM"
        },
        {
          "name": "Sao Tome and Principe",
          "code": "STP"
        },
        {
          "name": "Scotland",
          "code": "GB"
        },
        {
          "name": "Senegal",
          "code": "SEN"
        },
        {
          "name": "Seychelles",
          "code": "SYC"
        },
        {
          "name": "Sierra Leone",
          "code": "SLE"
        },
        {
          "name": "Solomon Islands",
          "code": "SLB"
        },
        {
          "name": "Somalia",
          "code": "SOM"
        },
        {
          "name": "South Sudan",
          "code": "SSD"
        },
        {
          "name": "St. Eustatius",
          "code": "BES"
        },
        {
          "name": "St. Kitts",
          "code": "KNA"
        },
        {
          "name": "St. Lucia",
          "code": "LCA"
        },
        {
          "name": "St. Marteen",
          "code": "MAF"
        },
        {
          "name": "St. Vincent",
          "code": "VCT"
        },
        {
          "name": "Sudan",
          "code": "SDN"
        },
        {
          "name": "Suriname",
          "code": "SUR"
        },
        {
          "name": "Swaziland",
          "code": "SWZ"
        },
        {
          "name": "Syria",
          "code": "SYR"
        },
        {
          "name": "Tajikistan",
          "code": "TJK"
        },
        {
          "name": "Tanzania",
          "code": "TZA"
        },
        {
          "name": "The D.P.R of Korea",
          "code": "PRK"
        },
        {
          "name": "Togo",
          "code": "TGO"
        },
        {
          "name": "Tonga",
          "code": "TON"
        },
        {
          "name": "Trinidad and Tobago",
          "code": "TTO"
        },
        {
          "name": "Turkmenistan",
          "code": "TKM"
        },
        {
          "name": "Turks and Caicos Islands",
          "code": "TCA"
        },
        {
          "name": "Uganda",
          "code": "UGA"
        },
        {
          "name": "United States of America",
          "code": "USA"
        },
        {
          "name": "Uzbekistan",
          "code": "UZB"
        },
        {
          "name": "Vanuatu",
          "code": "VUT"
        },
        {
          "name": "Venezuela",
          "code": "VEN"
        },
        {
          "name": "Virgin Islands (British)",
          "code": "VGB"
        },
        {
          "name": "Virgin Islands (US)",
          "code": "VIR"
        },
        {
          "name": "Wales",
          "code": "GB"
        },
        {
          "name": "Yugoslavia",
          "code": "YU"
        },
        {
          "name": "Zambia",
          "code": "ZMB"
        },
        {
          "name": "Zimbabwe",
          "code": "ZWE"
        }
      ]
    },
    {
      "currency_code": "EUR",
      "country_list": [
        {
          "name": "Albania",
          "code": "ALB"
        },
        {
          "name": "Andorra",
          "code": "AND"
        },
        {
          "name": "Anguilla",
          "code": "AIA"
        },
        {
          "name": "Aruba",
          "code": "ABW"
        },
        {
          "name": "Austria",
          "code": "AUT"
        },
        {
          "name": "Azerbaijan",
          "code": "AZE"
        },
        {
          "name": "Bahrain",
          "code": "BHR"
        },
        {
          "name": "Belgium",
          "code": "BEL"
        },
        {
          "name": "Benin",
          "code": "BEN"
        },
        {
          "name": "Bosnia & Herzegovina",
          "code": "BIH"
        },
        {
          "name": "Botswana",
          "code": "BWA"
        },
        {
          "name": "Brunei",
          "code": "BRN"
        },
        {
          "name": "Burkina Faso",
          "code": "BFA"
        },
        {
          "name": "Cyprus",
          "code": "CYP"
        },
        {
          "name": "Estonia",
          "code": "EST"
        },
        {
          "name": "Finland",
          "code": "FIN"
        },
        {
          "name": "France",
          "code": "FRA"
        },
        {
          "name": "French Guiana",
          "code": "GUF"
        },
        {
          "name": "Germany",
          "code": "DEU"
        },
        {
          "name": "Greece",
          "code": "GRC"
        },
        {
          "name": "Guadeloupe",
          "code": "GLP"
        },
        {
          "name": "Guernsey",
          "code": "GGY"
        },
        {
          "name": "Iceland",
          "code": "ISL"
        },
        {
          "name": "Island of Reunion",
          "code": "REU"
        },
        {
          "name": "Italy",
          "code": "ITA"
        },
        {
          "name": "Jersey",
          "code": "JEY"
        },
        {
          "name": "Kazakhstan",
          "code": "KAZ"
        },
        {
          "name": "Kyrgyzstan",
          "code": "KGZ"
        },
        {
          "name": "Latvia",
          "code": "LVA"
        },
        {
          "name": "Liberia",
          "code": "LBR"
        },
        {
          "name": "Lithuania",
          "code": "LTU"
        },
        {
          "name": "Luxembourg",
          "code": "LUX"
        },
        {
          "name": "Malta",
          "code": "MLT"
        },
        {
          "name": "Martinique",
          "code": "MTQ"
        },
        {
          "name": "Mayotte",
          "code": "MYT"
        },
        {
          "name": "Monaco",
          "code": "MCO"
        },
        {
          "name": "Mongolia",
          "code": "MNG"
        },
        {
          "name": "Montserrat",
          "code": "MSR"
        },
        {
          "name": "Mozambique",
          "code": "MOZ"
        },
        {
          "name": "Portugal",
          "code": "PRT"
        },
        {
          "name": "Republic of Ireland",
          "code": "IRL"
        },
        {
          "name": "Republic of Montenegro",
          "code": "MNE"
        },
        {
          "name": "San Marino",
          "code": "SMR"
        },
        {
          "name": "Slovakia",
          "code": "SVK"
        },
        {
          "name": "Slovenia",
          "code": "SVN"
        },
        {
          "name": "Spain",
          "code": "ESP"
        },
        {
          "name": "St. Barthelemy",
          "code": "BLM"
        },
        {
          "name": "The Canary Islands",
          "code": "IC"
        },
        {
          "name": "The Netherlands",
          "code": "NLD"
        },
        {
          "name": "Vatican City State",
          "code": "VAT"
        }
      ]
    },
    {
      "currency_code": "DZD",
      "country_list": [
        {
          "name": "Algeria",
          "code": "DZA"
        }
      ]
    },
    {
      "currency_code": "ARS",
      "country_list": [
        {
          "name": "Argentina",
          "code": "ARG"
        }
      ]
    },
    {
      "currency_code": "AUD",
      "country_list": [
        {
          "name": "Australia",
          "code": "AUS"
        },
        {
          "name": "Tuvalu",
          "code": "TUV"
        }
      ]
    },
    {
      "currency_code": "BDT",
      "country_list": [
        {
          "name": "Bangladesh",
          "code": "BGD"
        }
      ]
    },
    {
      "currency_code": "BYN",
      "country_list": [
        {
          "name": "Belarus",
          "code": "BLR"
        }
      ]
    },
    {
      "currency_code": "GBP",
      "country_list": [
        {
          "name": "Bermuda",
          "code": "BMU"
        },
        {
          "name": "Guyana (British)",
          "code": "GUY"
        },
        {
          "name": "United Kingdom",
          "code": "GBR"
        }
      ]
    },
    {
      "currency_code": "BOB",
      "country_list": [
        {
          "name": "Bolivia",
          "code": "BOL"
        }
      ]
    },
    {
      "currency_code": "BRL",
      "country_list": [
        {
          "name": "Brazil",
          "code": "BRA"
        }
      ]
    },
    {
      "currency_code": "BGN",
      "country_list": [
        {
          "name": "Bulgaria",
          "code": "BGR"
        }
      ]
    },
    {
      "currency_code": "CAD",
      "country_list": [
        {
          "name": "Canada",
          "code": "CAN"
        }
      ]
    },
    {
      "currency_code": "CLP",
      "country_list": [
        {
          "name": "Chile",
          "code": "CHL"
        }
      ]
    },
    {
      "currency_code": "COP",
      "country_list": [
        {
          "name": "Colombia",
          "code": "COL"
        }
      ]
    },
    {
      "currency_code": "NZD",
      "country_list": [
        {
          "name": "Cook Islands",
          "code": "COK"
        },
        {
          "name": "New Zealand",
          "code": "NZL"
        },
        {
          "name": "Niue",
          "code": "NIU"
        }
      ]
    },
    {
      "currency_code": "HRK",
      "country_list": [
        {
          "name": "Croatia",
          "code": "HRV"
        }
      ]
    },
    {
      "currency_code": "DKK",
      "country_list": [
        {
          "name": "Denmark",
          "code": "DNK"
        },
        {
          "name": "Greenland",
          "code": "GRL"
        }
      ]
    },
    {
      "currency_code": "DOP",
      "country_list": [
        {
          "name": "Dominican Republic",
          "code": "DOM"
        }
      ]
    },
    {
      "currency_code": "EGP",
      "country_list": [
        {
          "name": "Egypt",
          "code": "EGY"
        }
      ]
    },
    {
      "currency_code": "GHS",
      "country_list": [
        {
          "name": "Ghana",
          "code": "GHA"
        }
      ]
    },
    {
      "currency_code": "GIP",
      "country_list": [
        {
          "name": "Gibraltar",
          "code": "GIB"
        }
      ]
    },
    {
      "currency_code": "HKD",
      "country_list": [
        {
          "name": "Hong Kong",
          "code": "HKG"
        }
      ]
    },
    {
      "currency_code": "HUF",
      "country_list": [
        {
          "name": "Hungary",
          "code": "HUN"
        }
      ]
    },
    {
      "currency_code": "INR",
      "country_list": [
        {
          "name": "India",
          "code": "IN"
        }
      ]
    },
    {
      "currency_code": "IDR",
      "country_list": [
        {
          "name": "Indonesia",
          "code": "IDN"
        }
      ]
    },
    {
      "currency_code": "ILS",
      "country_list": [
        {
          "name": "Israel",
          "code": "ISR"
        }
      ]
    },
    {
      "currency_code": "JPY",
      "country_list": [
        {
          "name": "Japan",
          "code": "JPN"
        }
      ]
    },
    {
      "currency_code": "JOD",
      "country_list": [
        {
          "name": "Jordan",
          "code": "JOR"
        }
      ]
    },
    {
      "currency_code": "KES",
      "country_list": [
        {
          "name": "Kenya",
          "code": "KEN"
        }
      ]
    },
    {
      "currency_code": "KWD",
      "country_list": [
        {
          "name": "Kuwait",
          "code": "KWT"
        }
      ]
    },
    {
      "currency_code": "LBP",
      "country_list": [
        {
          "name": "Lebanon",
          "code": "LBN"
        }
      ]
    },
    {
      "currency_code": "CHF",
      "country_list": [
        {
          "name": "Liechtenstein",
          "code": "LIE"
        },
        {
          "name": "Switzerland",
          "code": "CHE"
        }
      ]
    },
    {
      "currency_code": "MYR",
      "country_list": [
        {
          "name": "Malaysia",
          "code": "MYS"
        }
      ]
    },
    {
      "currency_code": "MXN",
      "country_list": [
        {
          "name": "Mexico",
          "code": "MEX"
        }
      ]
    },
    {
      "currency_code": "MAD",
      "country_list": [
        {
          "name": "Morocco",
          "code": "MAR"
        }
      ]
    },
    {
      "currency_code": "NAD",
      "country_list": [
        {
          "name": "Namibia",
          "code": "NAM"
        }
      ]
    },
    {
      "currency_code": "NGN",
      "country_list": [
        {
          "name": "Nigeria",
          "code": "NGA"
        }
      ]
    },
    {
      "currency_code": "NOK",
      "country_list": [
        {
          "name": "Norway",
          "code": "NOR"
        }
      ]
    },
    {
      "currency_code": "OMR",
      "country_list": [
        {
          "name": "Oman",
          "code": "OMN"
        }
      ]
    },
    {
      "currency_code": "PYG",
      "country_list": [
        {
          "name": "Paraguay",
          "code": "PRY"
        }
      ]
    },
    {
      "currency_code": "CNY",
      "country_list": [
        {
          "name": "People's Republic of China",
          "code": "CHN"
        }
      ]
    },
    {
      "currency_code": "PEN",
      "country_list": [
        {
          "name": "Peru",
          "code": "PER"
        }
      ]
    },
    {
      "currency_code": "PLN",
      "country_list": [
        {
          "name": "Poland",
          "code": "POL"
        }
      ]
    },
    {
      "currency_code": "QAR",
      "country_list": [
        {
          "name": "Qatar",
          "code": "QAT"
        }
      ]
    },
    {
      "currency_code": "MDL",
      "country_list": [
        {
          "name": "Republic of Moldova",
          "code": "MDA"
        }
      ]
    },
    {
      "currency_code": "RSD",
      "country_list": [
        {
          "name": "Republic of Serbia",
          "code": "SRB"
        }
      ]
    },
    {
      "currency_code": "RON",
      "country_list": [
        {
          "name": "Romania",
          "code": "ROU"
        }
      ]
    },
    {
      "currency_code": "SAR",
      "country_list": [
        {
          "name": "Saudi Arabia",
          "code": "SAU"
        }
      ]
    },
    {
      "currency_code": "SGD",
      "country_list": [
        {
          "name": "Singapore",
          "code": "SGP"
        }
      ]
    },
    {
      "currency_code": "ZAR",
      "country_list": [
        {
          "name": "South Africa",
          "code": "ZAF"
        }
      ]
    },
    {
      "currency_code": "LKR",
      "country_list": [
        {
          "name": "Sri Lanka",
          "code": "LKA"
        }
      ]
    },
    {
      "currency_code": "SEK",
      "country_list": [
        {
          "name": "Sweden",
          "code": "SWE"
        }
      ]
    },
    {
      "currency_code": "TWD",
      "country_list": [
        {
          "name": "Taiwan",
          "code": "TWN"
        }
      ]
    },
    {
      "currency_code": "THB",
      "country_list": [
        {
          "name": "Thailand",
          "code": "THA"
        }
      ]
    },
    {
      "currency_code": "CZK",
      "country_list": [
        {
          "name": "The Czech Republic",
          "code": "CZE"
        }
      ]
    },
    {
      "currency_code": "PHP",
      "country_list": [
        {
          "name": "The Philippines",
          "code": "PHL"
        }
      ]
    },
    {
      "currency_code": "RUB",
      "country_list": [
        {
          "name": "The Russian Federation",
          "code": "RUS"
        }
      ]
    },
    {
      "currency_code": "TND",
      "country_list": [
        {
          "name": "Tunisia",
          "code": "TUN"
        }
      ]
    },
    {
      "currency_code": "TRY",
      "country_list": [
        {
          "name": "Turkey",
          "code": "TUR"
        }
      ]
    },
    {
      "currency_code": "UAH",
      "country_list": [
        {
          "name": "Ukraine",
          "code": "UKR"
        }
      ]
    },
    {
      "currency_code": "AED",
      "country_list": [
        {
          "name": "United Arab Emirates",
          "code": "ARE"
        }
      ]
    },
    {
      "currency_code": "UYU",
      "country_list": [
        {
          "name": "Uruguay",
          "code": "URY"
        }
      ]
    },
    {
      "currency_code": "VND",
      "country_list": [
        {
          "name": "Vietnam",
          "code": "VNM"
        }
      ]
    },
    {
      "currency_code": "PKR",
      "country_list": [
        {
          "name": "Pakistan",
          "code": "PK"
        }
      ]
    }
  ];
  ipUrls: any = [
    "https://ipapi.co/json",
    "https://freegeoip.app/json/",
    "https://api.db-ip.com/v2/free/self"
  ];
  
  constructor(public router: Router, private activeRoute: ActivatedRoute, private api: ApiService, public commonService: CommonService, private cookieService: CookieService) {
    this.signupForm = {
      country: "India", currency_code: "INR",
      company_details: { dial_code: "+91", state: "" }, category: "", type: ""
    };
    if(environment.keep_login) this.signupForm.signup_from = "app";
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((queryParams: Params) => {
      this.queryParams = queryParams;
      this.activeRoute.params.subscribe((params: Params) => {
        this.params = params;
        if(this.queryParams.p == "home" && this.queryParams.s == "header" && this.queryParams.b == "Start Selling") {
          this.leadSource = "Index Navbar Signup";
        }
        if(this.queryParams.p == "multivendor") {
          if(this.queryParams.s == "Section1" && this.queryParams.b == "Start marketplace") this.leadSource = "MV Hero Section Signup";
          if(this.queryParams.s == "Section5" && this.queryParams.b == "Start marketplace") this.leadSource = "MV Orders Section Signup";
          if(this.queryParams.s == "Section6" && this.queryParams.b == "Start marketplace") this.leadSource = "MV Plans Section Signup";
        }
        else if(this.queryParams.p == "b2b") {
          if(this.queryParams.s == "section1" && this.queryParams.b == "Start B2B Ecommerce") this.leadSource = "B2B Hero Section Signup";
          if(this.queryParams.s == "section4" && this.queryParams.b == "Start B2B Ecommerce") this.leadSource = "B2B Experience Section Signup";
          if(this.queryParams.s == "Ribbon" && this.queryParams.b == "Start B2B Ecommerce") this.leadSource = "B2B Ribbon Signup";
        }
        else if(this.queryParams.p == "services") {
          if(this.queryParams.s == "Section1" && this.queryParams.b == "Start Selling") this.leadSource = "Services Hero Section Signup";
          if(this.queryParams.s == "Section4" && this.queryParams.b == "Start Selling") this.leadSource = "Services Appointment Section Signup";
          if(this.queryParams.s == "Section5" && this.queryParams.b == "Start Selling") this.leadSource = "Services Scheduling Section Signup";
          if(this.queryParams.s == "One-stop Section" && this.queryParams.b == "Start Selling") this.leadSource = "Services One-stop Section Signup";
        }        
        else if(this.queryParams.p == "readymade-ecommerce") {
          if(this.queryParams.s == "Section1" && this.queryParams.b == "Start Selling") this.leadSource = "Readymade Hero App Signup";
          if(this.queryParams.s == "Section5" && this.queryParams.b == "Start Selling") this.leadSource = "Readymade Setup Section Signup";          
        }
        this.formTrigger('0');
      });
    });
    // country list
    this.pageLoader = true;
    if(!localStorage.getItem("country_list")) {
      this.api.COUNTRIES_LIST().subscribe(result => {
        this.commonService.country_list = [];
        if(result.status) this.commonService.country_list = result.list;
        this.commonService.updateLocalData('country_list', this.commonService.country_list);
        this.ipTrigger();
      });
    }
    else this.ipTrigger();
  }

  formTrigger(stepNum) {
    if(environment.production) {
      let objData: any = {
        s_id: this.commonService.sessionId, form_data: this.signupForm, category: 'genie',
        params: this.params, query_params: this.queryParams, step: this.step
      };
      if(this.router.url.indexOf('/pro') != -1) objData.category = 'pro';
      if(this.queryParams.from) objData.from = this.queryParams.from;
      if(this.queryParams.site) objData.referral_site = this.queryParams.site;
      if(environment.keep_login) objData.from = "app";
      if(stepNum=='1') objData.step_1 = true;
      if(stepNum=='2') objData.step_2 = true;
      if(stepNum=='3') objData.step_3 = true;
      if(stepNum=='4') objData.step_4 = true;
      if(this.step>1 && this.zohoLeadId) objData.lead_id = this.zohoLeadId;
      if(this.leadSource) objData.lead_source = this.leadSource;
      this.api.SIGNUP_LOG(objData).subscribe(result => {
        if(result.lead_id) this.zohoLeadId = result.lead_id;
        if(!result.status) console.log("response", result);
      });
    }
  }

  ipTrigger() {
    if(environment.production) {
      if(sessionStorage.getItem("ip_info")) {
        this.getCurrencyType(JSON.parse(sessionStorage.getItem("ip_info")));
      }
      else {
        let ipIndex = "0"; let ipIndexList = [];
        this.ipUrls.forEach((element, index) => {
          ipIndexList.push(index.toString());
        });
        if(localStorage.getItem("ip_index")) ipIndex = localStorage.getItem("ip_index");
        ipIndexList.splice(ipIndexList.indexOf(ipIndex), 1);
        // call api(1)
        this.getIpInfo(ipIndex)
        .then((ipInfo) => { this.getCurrencyType(ipInfo); })
        .catch((err) => {
          ipIndex = ipIndexList[0]; ipIndexList.splice(0, 1);
          // call api(2)
          this.getIpInfo(ipIndex)
          .then((ipInfo) => {this.getCurrencyType(ipInfo); })
          .catch((err) => {
            ipIndex = ipIndexList[0]; ipIndexList.splice(0, 1);
            // call api(3)
            this.getIpInfo(ipIndex)
            .then((ipInfo) => { this.getCurrencyType(ipInfo); })
            .catch((err) => {
              console.log("-----err", err);
              this.onCountryChange(this.signupForm.country);
              setTimeout(() => { this.pageLoader = false; }, 500);
            });
          });
        });
      }
    }
    else {
      this.pageLoader = false;
      this.onCountryChange(this.signupForm.country);
    }
  }

  getIpInfo(ipIndex) {
    return new Promise((resolve, reject) => {
      this.api.IP_INFO(this.ipUrls[Number(ipIndex)]).subscribe(result => {
        localStorage.setItem("ip_index", ipIndex);
        if(ipIndex==="0" || ipIndex==="1") {
          if(result.country_name && result.country_code) {
            let ipInfo = { country_name: result.country_name, country_code: result.country_code };
            resolve(ipInfo);
          }
          else resolve(null);
        }
        else if(ipIndex==="2") {
          if(result.countryName && result.countryCode) {
            let ipInfo = { country_name: result.countryName, country_code: result.countryCode };
            resolve(ipInfo);
          }
          else resolve(null);
        }
        else resolve(null);
      },
      (error) => { reject(error); });
    });
  }
  getCurrencyType(ipInfo) {
    if(ipInfo) {
      sessionStorage.setItem("ip_info", JSON.stringify(ipInfo));
      // country and dial code
      let ctCode = this.optString(ipInfo.country_code);
      let ctName = this.optString(ipInfo.country_name);
      let cIndex = this.commonService.country_list.findIndex(el => this.optString(el.code)==ctCode || this.optString(el.name).indexOf(ctName)!=-1);
      if(cIndex != -1) {
        this.signupForm.country = this.commonService.country_list[cIndex].name;
        this.signupForm.company_details.dial_code = this.commonService.country_list[cIndex].dial_code;
        this.onCountryChange(this.signupForm.country);
        setTimeout(() => { this.formTrigger('0'); }, 1000);
      }
    }
    setTimeout(() => { this.pageLoader = false; }, 500);
  }
  optString(str) {
    return str.replace(/[^A-Z0-9]/ig, "").toLowerCase();
  }

  onSubmit() {
    this.signupForm.submit = true;
    this.signupForm.signup_by = 'self';
    this.signupForm.company_details.name = this.signupForm.name;
    if(this.router.url.indexOf('/pro') != -1) this.signupForm.ys_category = 'pro';
    if(this.router.url.indexOf('/customer-signup') != -1) this.signupForm.signup_by = 'manual';
    if(this.params.service) {
      let sIndex = this.commonService.ys_services.findIndex(obj => obj.short_name==this.params.service);
      if(sIndex!=-1) this.signupForm.type = this.commonService.ys_services[sIndex].name;
    }
    if(!this.signupForm.type) delete this.signupForm.type;
    this.signupForm.query_params = this.queryParams;
    let cIndex = this.currencyList.findIndex(el => el.country_code==this.signupForm.currency_code);
    this.signupForm.currency_types = this.currencyList[cIndex];
    if(localStorage.getItem('app_token')) this.signupForm.app_token = localStorage.getItem('app_token');
    if(this.cookieService.check('app_token')) this.signupForm.app_token = this.cookieService.get('app_token');
    sessionStorage.setItem('formData', JSON.stringify(this.signupForm));
    this.api.SIGNUP(this.signupForm).subscribe(result => {
      if(result.status == true) this.router.navigate(['/welcome/created']);
      else {
        console.log("response", result);
        this.signupForm.errorMsg = result.message;
      }
      setTimeout(() => { this.signupForm.submit = false; }, 500);
    });
  }

  prevStep() {
    delete this.signupForm.submit;
    delete this.signupForm.errorMsg;
    this.step--;
  }
  nextStep() {
    delete this.signupForm.submit;
    delete this.signupForm.errorMsg;
    this.step++;
  }

  validateEmail(x) {
    this.signupForm.submit = true;
    this.api.VALIDATE_EMAIL({ email: x }).subscribe(result => {
      if(result.status == true) this.nextStep();
      else {
        console.log("response", result);
        this.signupForm.errorMsg = result.message;
      }
      setTimeout(() => { this.signupForm.submit = false; }, 500);
    });
  }

  onCountryChange(x) {
    this.stateList = [];
    let index = this.commonService.country_list.findIndex(object => object.name==x);
    if(index!=-1) this.stateList = this.commonService.country_list[index].states;
    // currency code
    let countryCurrency = this.ipList.filter(obj => obj.country_list.findIndex(el => el.name==x)!=-1);
    if(countryCurrency.length) {
      let ipIndex = this.currencyList.findIndex(obj => obj.country_code==countryCurrency[0].currency_code);
      if(ipIndex!=-1) {
        this.signupForm.currency_code = this.currencyList[ipIndex].country_code;
      }
    }
  }

}