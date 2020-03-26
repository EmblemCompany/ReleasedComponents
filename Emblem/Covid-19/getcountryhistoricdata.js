exports.id = 'getcountryhistoricdata';
exports.title = 'Get Country Historic Data';
exports.group = 'Covid-19';
exports.color = '#002d72';
exports.input = true;
exports.output = true;
exports.author = 'Dawn Code <dawn@unspecified.me>';
exports.icon = 'lungs-virus';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [ ];

exports.readme = '60000632000';

exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-12">
            <div data-jc="dropdown" data-jc-path="country" data-jc-config="datasource:countries;required" class="m">@(Country)</div><div class="help"></div>
        </div>
    </div>
</div>
<script>
	var countries = [
        {name:'Afghanistan',id:'AFG'},
        {name:'Aland Islands',id:'ALA'},
        {name:'Albania',id:'ALB'},
        {name:'Algeria',id:'DZA'},
        {name:'American Samoa',id:'ASM'},
        {name:'Andorra',id:'AND'},
        {name:'Angola',id:'AGO'},
        {name:'Anguilla',id:'AIA'},
        {name:'Antarctica',id:'ATA'},
        {name:'Antigua and Barbuda',id:'ATG'},
        {name:'Argentina',id:'ARG'},
        {name:'Armenia',id:'ARM'},
        {name:'Aruba',id:'ABW'},
        {name:'Australia',id:'AUS'},
        {name:'Austria',id:'AUT'},
        {name:'Azerbaijan',id:'AZE'},
        {name:'Bahamas',id:'BHS'},
        {name:'Bahrain',id:'BHR'},
        {name:'Bangladesh',id:'BGD'},
        {name:'Barbados',id:'BRB'},
        {name:'Belarus',id:'BLR'},
        {name:'Belgium',id:'BEL'},
        {name:'Belize',id:'BLZ'},
        {name:'Benin',id:'BEN'},
        {name:'Bermuda',id:'BMU'},
        {name:'Bhutan',id:'BTN'},
        {name:'Bolivia',id:'BOL'},
        {name:'Bosnia and Herzegovina',id:'BIH'},
        {name:'Botswana',id:'BWA'},
        {name:'Bouvet Island',id:'BVT'},
        {name:'Brazil',id:'BRA'},
        {name:'British Virgin Islands',id:'VGB'},
        {name:'British Indian Ocean Territory',id:'IOT'},
        {name:'Brunei Darussalam',id:'BRN'},
        {name:'Bulgaria',id:'BGR'},
        {name:'Burkina Faso',id:'BFA'},
        {name:'Burundi',id:'BDI'},
        {name:'Cambodia',id:'KHM'},
        {name:'Cameroon',id:'CMR'},
        {name:'Canada',id:'CAN'},
        {name:'Cape Verde',id:'CPV'},
        {name:'Cayman Islands',id:'CYM'},
        {name:'Central African Republic',id:'CAF'},
        {name:'Chad',id:'TCD'},
        {name:'Chile',id:'CHL'},
        {name:'China',id:'CHN'},
        {name:'Hong Kong, SAR China',id:'HKG'},
        {name:'Macao, SAR China',id:'MAC'},
        {name:'Christmas Island',id:'CXR'},
        {name:'Cocos (Keeling) Islands',id:'CCK'},
        {name:'Colombia',id:'COL'},
        {name:'Comoros',id:'COM'},
        {name:'Congo (Brazzaville)',id:'COG'},
        {name:'Congo, (Kinshasa)',id:'COD'},
        {name:'Cook Islands',id:'COK'},
        {name:'Costa Rica',id:'CRI'},
        {name:'Côte d Ivoire',id:'CIV'},
        {name:'Croatia',id:'HRV'},
        {name:'Cuba',id:'CUB'},
        {name:'Cyprus',id:'CYP'},
        {name:'Czech Republic',id:'CZE'},
        {name:'Denmark',id:'DNK'},
        {name:'Djibouti',id:'DJI'},
        {name:'Dominica',id:'DMA'},
        {name:'Dominican Republic',id:'DOM'},
        {name:'Ecuador',id:'ECU'},
        {name:'Egypt',id:'EGY'},
        {name:'El Salvador',id:'SLV'},
        {name:'Equatorial Guinea',id:'GNQ'},
        {name:'Eritrea',id:'ERI'},
        {name:'Estonia',id:'EST'},
        {name:'Ethiopia',id:'ETH'},
        {name:'Falkland Islands (Malvinas)',id:'FLK'},
        {name:'Faroe Islands',id:'FRO'},
        {name:'Fiji',id:'FJI'},
        {name:'Finland',id:'FIN'},
        {name:'France',id:'FRA'},
        {name:'French Guiana',id:'GUF'},
        {name:'French Polynesia',id:'PYF'},
        {name:'French Southern Territories',id:'ATF'},
        {name:'Gabon',id:'GAB'},
        {name:'Gambia',id:'GMB'},
        {name:'Georgia',id:'GEO'},
        {name:'Germany',id:'DEU'},
        {name:'Ghana',id:'GHA'},
        {name:'Gibraltar',id:'GIB'},
        {name:'Greece',id:'GRC'},
        {name:'Greenland',id:'GRL'},
        {name:'Grenada',id:'GRD'},
        {name:'Guadeloupe',id:'GLP'},
        {name:'Guam',id:'GUM'},
        {name:'Guatemala',id:'GTM'},
        {name:'Guernsey',id:'GGY'},
        {name:'Guinea',id:'GIN'},
        {name:'Guinea-Bissau',id:'GNB'},
        {name:'Guyana',id:'GUY'},
        {name:'Haiti',id:'HTI'},
        {name:'Heard and Mcdonald Islands',id:'HMD'},
        {name:'Holy See (Vatican City State)',id:'VAT'},
        {name:'Honduras',id:'HND'},
        {name:'Hungary',id:'HUN'},
        {name:'Iceland',id:'ISL'},
        {name:'India',id:'IND'},
        {name:'Indonesia',id:'IDN'},
        {name:'Iran, Islamic Republic of',id:'IRN'},
        {name:'Iraq',id:'IRQ'},
        {name:'Ireland',id:'IRL'},
        {name:'Isle of Man',id:'IMN'},
        {name:'Israel',id:'ISR'},
        {name:'Italy',id:'ITA'},
        {name:'Jamaica',id:'JAM'},
        {name:'Japan',id:'JPN'},
        {name:'Jersey',id:'JEY'},
        {name:'Jordan',id:'JOR'},
        {name:'Kazakhstan',id:'KAZ'},
        {name:'Kenya',id:'KEN'},
        {name:'Kiribati',id:'KIR'},
        {name:'Korea (North)',id:'PRK'},
        {name:'Korea (South)',id:'KOR'},
        {name:'Kuwait',id:'KWT'},
        {name:'Kyrgyzstan',id:'KGZ'},
        {name:'Lao PDR',id:'LAO'},
        {name:'Latvia',id:'LVA'},
        {name:'Lebanon',id:'LBN'},
        {name:'Lesotho',id:'LSO'},
        {name:'Liberia',id:'LBR'},
        {name:'Libya',id:'LBY'},
        {name:'Liechtenstein',id:'LIE'},
        {name:'Lithuania',id:'LTU'},
        {name:'Luxembourg',id:'LUX'},
        {name:'Macedonia, Republic of',id:'MKD'},
        {name:'Madagascar',id:'MDG'},
        {name:'Malawi',id:'MWI'},
        {name:'Malaysia',id:'MYS'},
        {name:'Maldives',id:'MDV'},
        {name:'Mali',id:'MLI'},
        {name:'Malta',id:'MLT'},
        {name:'Marshall Islands',id:'MHL'},
        {name:'Martinique',id:'MTQ'},
        {name:'Mauritania',id:'MRT'},
        {name:'Mauritius',id:'MUS'},
        {name:'Mayotte',id:'MYT'},
        {name:'Mexico',id:'MEX'},
        {name:'Micronesia, Federated States of',id:'FSM'},
        {name:'Moldova',id:'MDA'},
        {name:'Monaco',id:'MCO'},
        {name:'Mongolia',id:'MNG'},
        {name:'Montenegro',id:'MNE'},
        {name:'Montserrat',id:'MSR'},
        {name:'Morocco',id:'MAR'},
        {name:'Mozambique',id:'MOZ'},
        {name:'Myanmar',id:'MMR'},
        {name:'Namibia',id:'NAM'},
        {name:'Nauru',id:'NRU'},
        {name:'Nepal',id:'NPL'},
        {name:'Netherlands',id:'NLD'},
        {name:'Netherlands Antilles',id:'ANT'},
        {name:'New Caledonia',id:'NCL'},
        {name:'New Zealand',id:'NZL'},
        {name:'Nicaragua',id:'NIC'},
        {name:'Niger',id:'NER'},
        {name:'Nigeria',id:'NGA'},
        {name:'Niue',id:'NIU'},
        {name:'Norfolk Island',id:'NFK'},
        {name:'Northern Mariana Islands',id:'MNP'},
        {name:'Norway',id:'NOR'},
        {name:'Oman',id:'OMN'},
        {name:'Pakistan',id:'PAK'},
        {name:'Palau',id:'PLW'},
        {name:'Palestinian Territory',id:'PSE'},
        {name:'Panama',id:'PAN'},
        {name:'Papua New Guinea',id:'PNG'},
        {name:'Paraguay',id:'PRY'},
        {name:'Peru',id:'PER'},
        {name:'Philippines',id:'PHL'},
        {name:'Pitcairn',id:'PCN'},
        {name:'Poland',id:'POL'},
        {name:'Portugal',id:'PRT'},
        {name:'Puerto Rico',id:'PRI'},
        {name:'Qatar',id:'QAT'},
        {name:'Réunion',id:'REU'},
        {name:'Romania',id:'ROU'},
        {name:'Russian Federation',id:'RUS'},
        {name:'Rwanda',id:'RWA'},
        {name:'Saint-Barthélemy',id:'BLM'},
        {name:'Saint Helena',id:'SHN'},
        {name:'Saint Kitts and Nevis',id:'KNA'},
        {name:'Saint Lucia',id:'LCA'},
        {name:'Saint-Martin (French part)',id:'MAF'},
        {name:'Saint Pierre and Miquelon',id:'SPM'},
        {name:'Saint Vincent and Grenadines',id:'VCT'},
        {name:'Samoa',id:'WSM'},
        {name:'San Marino',id:'SMR'},
        {name:'Sao Tome and Principe',id:'STP'},
        {name:'Saudi Arabia',id:'SAU'},
        {name:'Senegal',id:'SEN'},
        {name:'Serbia',id:'SRB'},
        {name:'Seychelles',id:'SYC'},
        {name:'Sierra Leone',id:'SLE'},
        {name:'Singapore',id:'SGP'},
        {name:'Slovakia',id:'SVK'},
        {name:'Slovenia',id:'SVN'},
        {name:'Solomon Islands',id:'SLB'},
        {name:'Somalia',id:'SOM'},
        {name:'South Africa',id:'ZAF'},
        {name:'South Georgia and the South Sandwich Islands',id:'SGS'},
        {name:'South Sudan',id:'SSD'},
        {name:'Spain',id:'ESP'},
        {name:'Sri Lanka',id:'LKA'},
        {name:'Sudan',id:'SDN'},
        {name:'Suriname',id:'SUR'},
        {name:'Svalbard and Jan Mayen Islands',id:'SJM'},
        {name:'Swaziland',id:'SWZ'},
        {name:'Sweden',id:'SWE'},
        {name:'Switzerland',id:'CHE'},
        {name:'Syrian Arab Republic (Syria)',id:'SYR'},
        {name:'Taiwan, Republic of China',id:'TWN'},
        {name:'Tajikistan',id:'TJK'},
        {name:'Tanzania, United Republic of',id:'TZA'},
        {name:'Thailand',id:'THA'},
        {name:'Timor-Leste',id:'TLS'},
        {name:'Togo',id:'TGO'},
        {name:'Tokelau',id:'TKL'},
        {name:'Tonga',id:'TON'},
        {name:'Trinidad and Tobago',id:'TTO'},
        {name:'Tunisia',id:'TUN'},
        {name:'Turkey',id:'TUR'},
        {name:'Turkmenistan',id:'TKM'},
        {name:'Turks and Caicos Islands',id:'TCA'},
        {name:'Tuvalu',id:'TUV'},
        {name:'Uganda',id:'UGA'},
        {name:'Ukraine',id:'UKR'},
        {name:'United Arab Emirates',id:'ARE'},
        {name:'United Kingdom',id:'GBR'},
        {name:'United States of America',id:'USA'},
        {name:'US Minor Outlying Islands',id:'UMI'},
        {name:'Uruguay',id:'URY'},
        {name:'Uzbekistan',id:'UZB'},
        {name:'Vanuatu',id:'VUT'},
        {name:'Venezuela (Bolivarian Republic)',id:'VEN'},
        {name:'Viet Nam',id:'VNM'},
        {name:'Virgin Islands, US',id:'VIR'},
        {name:'Wallis and Futuna Islands',id:'WLF'},
        {name:'Western Sahara',id:'ESH'},
        {name:'Yemen',id:'YEM'},
        {name:'Zambia',id:'ZMB'},
        {name:'Zimbabwe',id:'ZWE'}
    ];
</script>
`;

exports.install = function(instance) {
    checkConfigure();

    instance.on('data', function(flowdata) {
        runIt(flowdata);
    });

    instance.custom.reconfigure = function() {
        checkConfigure();
    };

    instance.on('options', instance.custom.reconfigure);
    
    function checkConfigure() {
        if (!instance.options.country) {
            instance.status("Not configured", "red");
        } else {
            instance.status('');
        };
    };

    async function runIt(flowdata) {

        let data;

        var request = require('request');
        var options = {
            'method': 'GET',
            'url': 'https://covidapi.info/api/v1/country/' + instance.options.country,
            'headers': {}
        };

        request(options, function (error, response) { 
            if (error) throw new Error(error);
            data = JSON.parse(response.body);

            flowdata.data = data;

            if (instance.options.downstream) {
                flowdata.set(instance.name, flowdata.data);
            };

            instance.send(flowdata);

        });
    };
};