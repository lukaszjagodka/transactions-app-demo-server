import { connection } from '../services/ormConnection';
import { fetch3x } from '../helpers/fetchCurrencies';
import { Currency } from "../entity/Currency";
import { IRow } from '../../types';
import { logger } from './logger';
import { CronJob } from 'cron';

const job = new CronJob('*/20 * * * *', async function() {
  try{
    const data: Array<IRow> = await fetch3x();
    if(data.length > 1){
      let objCurrencyPair = new Object();
      const arrayOfCurrencies = new Array();
      for(let i=0; i<data.length; i++){
        if(data[i].currency.includes('USD/') || data[i].currency.includes('/USD')){
          objCurrencyPair = {
            pair: data[i].currency,
            value: data[i].rate
          };
          arrayOfCurrencies.push(objCurrencyPair)
        }
      }
      connection.then(async connection => {
        let currency = new Currency();
        currency.currencyString = JSON.stringify(arrayOfCurrencies);
        currency.createdAt = new Date;
        await connection.manager.save(currency);
        logger.log({
          level: 'info',
          message: 'Success insert currencies',
          date: new Date()
        });
      }).catch(error => { logger.log({ level: 'error', message: error });
      });
    }else{
      logger.log({
        level: 'info',
        message: 'Limit of 3 requests/hour have been reached'
      });
    }
  }catch(err){
    logger.warn('error', new Error(err));
  }
}, null, true, 'Europe/Warsaw');

export default job;

// export let initialCurrenciesRates = [{
//   currency: 'EUR/USD', rate: '1.14168', bid: '1.14168', ask: '1.14177', high: '1.14219', low: '1.13543', open: '1.13655', close: '1.14168', timestamp: '1642000122882',
// }, {
//   currency: 'GBP/USD', rate: '1.369', bid: '1.369', ask: '1.36916', high: '1.36911', low: '1.36199', open: '1.36321', close: '1.369', timestamp: '1642000121959',
// }, {
//   currency: 'GBP/HUF', rate: '426.31', bid: '426.31', ask: '426.78', high: '428.53', low: '425.71', open: '427.91', close: '426.31', timestamp: '1642000122048',
// }, {
//   currency: 'EUR/JPY', rate: '131.389', bid: '131.389', ask: '131.407', high: '131.465', low: '130.97', open: '131.083', close: '131.389', timestamp: '1642000122337',
// }, {
//   currency: 'NZD/USD', rate: '0.68344', bid: '0.68344', ask: '0.68362', high: '0.68345', low: '0.6773', open: '0.67824', close: '0.68344', timestamp: '1642000122889',
// }, {
//   currency: 'USD/JPY', rate: '115.083', bid: '115.083', ask: '115.094', high: '115.461', low: '115.041', open: '115.331', close: '115.083', timestamp: '1642000118339',
// }, {
//   currency: 'EUR/CHF', rate: '1.04849', bid: '1.04849', ask: '1.04869', high: '1.05053', low: '1.04812', open: '1.04962', close: '1.04849', timestamp: '1642000119687',
// }, {
//   currency: 'USD/CHF', rate: '0.91836', bid: '0.91836', ask: '0.91852', high: '0.92438', low: '0.91809', open: '0.92349', close: '0.91836', timestamp: '1642000122960',
// }, {
//   currency: 'AUD/USD', rate: '0.72669', bid: '0.72669', ask: '0.7268', high: '0.72671', low: '0.72', open: '0.72093', close: '0.72669', timestamp: '1642000117713',
// }, {
//   currency: 'USD/CAD', rate: '1.25132', bid: '1.25132', ask: '1.25152', high: '1.25788', low: '1.25092', open: '1.2577', close: '1.25132', timestamp: '1642000122019',
// }, {
//   currency: 'EUR/GBP', rate: '0.83387', bid: '0.83387', ask: '0.83402', high: '0.83429', low: '0.83267', open: '0.8336', close: '0.83387', timestamp: '1642000119747',
// }, {
//   currency: 'BTC/USD', rate: '43747.43', bid: '43747.43', ask: '43937.61', high: '43997.2', low: '42360.28', open: '42644.0', close: '43747.43', timestamp: '1642000123389',
// }, {
//   currency: 'LTCUSD', rate: '135.83', bid: '135.83', ask: '139.26', high: '135.85', low: '129.23', open: '129.87', close: '135.83', timestamp: '1642000122010',
// }, {
//   currency: 'ETH', rate: '3372.08', bid: '3372.08', ask: '3380.53', high: '3380.33', low: '3203.45', open: '3236.41', close: '3372.08', timestamp: '1642000122934',
// }, {
//   currency: 'BNBUSD', rate: '481.0', bid: '481.0', ask: '483.9', high: '482.2', low: '455.2', open: '462.0', close: '481.0', timestamp: '1642000120274',
// }, {
//   currency: 'XRP', rate: '0.7908', bid: '0.7908', ask: '0.8028', high: '0.7939', low: '0.7519', open: '0.7646', close: '0.7908', timestamp: '1642000122952',
// }, {
//   currency: 'BCHUSD', rate: '380.27', bid: '380.27', ask: '383.13', high: '381.13', low: '366.67', open: '368.58', close: '380.27', timestamp: '1642000123309',
// }, {
//   currency: 'EOSUSD', rate: '2.861', bid: '2.861', ask: '2.89', high: '2.865', low: '2.75', open: '2.757', close: '2.861', timestamp: '1642000121325',
// }, {
//   currency: 'DASHUSD', rate: '142.38', bid: '142.38', ask: '144.53', high: '143.65', low: '137.47', open: '140.67', close: '142.38', timestamp: '1642000121335',
// }, {
//   currency: 'XLMUSD', rate: '0.2727', bid: '0.2727', ask: '0.2755', high: '0.2736', low: '0.2616', open: '0.2618', close: '0.2727', timestamp: '1642000123858',
// }, {
//   currency: 'NEOUSD', rate: '24.31', bid: '24.31', ask: '24.8', high: '24.43', low: '23.53', open: '23.58', close: '24.31', timestamp: '1642000122293',
// }, {
//   currency: 'MIOTAUSD', rate: '1.1883', bid: '1.1883', ask: '1.2063', high: '1.1885', low: '1.1256', open: '1.1325', close: '1.1883', timestamp: '1642000120803',
// }, {
//   currency: 'BTGUSD', rate: '36.78', bid: '36.78', ask: '37.53', high: '37.12', low: '35.45', open: '35.47', close: '36.78', timestamp: '1642000121258',
// }, {
//   currency: 'BTC/JPY', rate: '5044857.0', bid: '5044857.0', ask: '5060015.0', high: '5074036.0', low: '4894806.0', open: '4926308.0', close: '5044857.0', timestamp: '1642000122931',
// }, {
//   currency: 'BTC/EUR', rate: '38372.08', bid: '38372.08', ask: '38487.37', high: '38579.99', low: '37325.91', open: '37568.35', close: '38372.08', timestamp: '1642000116689',
// }, {
//   currency: 'EUR/AUD', rate: '1.57088', bid: '1.57088', ask: '1.57117', high: '1.57834', low: '1.57077', open: '1.57632', close: '1.57088', timestamp: '1642000122847',
// }, {
//   currency: 'USD/CNY', rate: '6.3622', bid: '6.3622', ask: '6.3642', high: '6.3766', low: '6.3604', open: '6.3766', close: '6.3622', timestamp: '1642000117282',
// }, {
//   currency: 'CAD/JPY', rate: '91.954', bid: '91.954', ask: '91.977', high: '92.17', low: '91.659', open: '91.689', close: '91.954', timestamp: '1642000122851',
// }, {
//   currency: 'GBP/CHF', rate: '1.25723', bid: '1.25723', ask: '1.25754', high: '1.2601', low: '1.25675', open: '1.25891', close: '1.25723', timestamp: '1642000122325',
// }, {
//   currency: 'GBP/JPY', rate: '157.55', bid: '157.55', ask: '157.575', high: '157.699', low: '157.052', open: '157.224', close: '157.55', timestamp: '1642000121237',
// }, {
//   currency: 'AUD/NZD', rate: '1.06306', bid: '1.06306', ask: '1.06341', high: '1.06476', low: '1.06193', open: '1.06272', close: '1.06306', timestamp: '1642000121933',
// }, {
//   currency: 'AUD/CAD', rate: '0.90932', bid: '0.90932', ask: '0.90959', high: '0.9098', low: '0.9036', open: '0.9067', close: '0.90932', timestamp: '1642000122957',
// }, {
//   currency: 'AUD/CHF', rate: '0.66732', bid: '0.66732', ask: '0.66759', high: '0.66768', low: '0.66489', open: '0.66573', close: '0.66732', timestamp: '1642000122843',
// }, {
//   currency: 'AUD/JPY', rate: '83.629', bid: '83.629', ask: '83.65', high: '83.669', low: '83.025', open: '83.15', close: '83.629', timestamp: '1642000119798',
// }, {
//   currency: 'EUR/NZD', rate: '1.67015', bid: '1.67015', ask: '1.67059', high: '1.67767', low: '1.67013', open: '1.6754', close: '1.67015', timestamp: '1642000122855',
// }, {
//   currency: 'CHF/JPY', rate: '125.296', bid: '125.296', ask: '125.321', high: '125.349', low: '124.76', open: '124.869', close: '125.296', timestamp: '1642000119745',
// }, {
//   currency: 'EUR/CAD', rate: '1.42861', bid: '1.42861', ask: '1.42894', high: '1.4302', low: '1.42333', open: '1.42944', close: '1.42861', timestamp: '1642000122967',
// }, {
//   currency: 'CAD/CHF', rate: '0.73376', bid: '0.73376', ask: '0.73405', high: '0.73677', low: '0.73303', open: '0.7341', close: '0.73376', timestamp: '1642000122962',
// }, {
//   currency: 'NZD/JPY', rate: '78.651', bid: '78.651', ask: '78.678', high: '78.657', low: '78.132', open: '78.223', close: '78.651', timestamp: '1642000123281',
// }, {
//   currency: 'USD/SGD', rate: '1.34806', bid: '1.34806', ask: '1.34839', high: '1.35141', low: '1.34797', open: '1.35055', close: '1.34806', timestamp: '1642000117700',
// }, {
//   currency: 'NZD/CAD', rate: '0.8552', bid: '0.8552', ask: '0.85556', high: '0.85564', low: '0.84929', open: '0.85299', close: '0.8552', timestamp: '1642000123376',
// }, {
//   currency: 'GBP/CAD', rate: '1.71308', bid: '1.71308', ask: '1.71348', high: '1.71501', low: '1.70796', open: '1.71451', close: '1.71308', timestamp: '1642000122859',
// }, {
//   currency: 'GBP/AUD', rate: '1.88371', bid: '1.88371', ask: '1.88403', high: '1.89282', low: '1.88324', open: '1.89073', close: '1.88371', timestamp: '1642000122863',
// }, {
//   currency: 'GBP/NZD', rate: '2.00272', bid: '2.00272', ask: '2.00324', high: '2.01329', low: '2.00249', open: '2.00955', close: '2.00272', timestamp: '1642000122867',
// }, {
//   currency: 'USD/HUF', rate: '311.49', bid: '311.49', ask: '311.67', high: '314.47', low: '311.31', open: '313.81', close: '311.49', timestamp: '1642000119750',
// }, {
//   currency: 'NZD/CHF', rate: '0.6276', bid: '0.6276', ask: '0.62793', high: '0.62778', low: '0.62464', open: '0.62628', close: '0.6276', timestamp: '1642000121404',
// }, {
//   currency: 'USD/DKK', rate: '6.5162', bid: '6.5162', ask: '6.5175', high: '6.5533', low: '6.5133', open: '6.5473', close: '6.5162', timestamp: '1642000122871',
// }, {
//   currency: 'USD/SEK', rate: '8.9634', bid: '8.9634', ask: '8.9714', high: '9.0511', low: '8.9568', open: '9.0331', close: '8.9634', timestamp: '1642000118807',
// }, {
//   currency: 'USD/MXN', rate: '20.3524', bid: '20.3524', ask: '20.3589', high: '20.442', low: '20.3133', open: '20.3922', close: '20.3524', timestamp: '1642000123286',
// }, {
//   currency: 'EUR/PLN', rate: '4.529', bid: '4.529', ask: '4.531', high: '4.542', low: '4.5281', open: '4.5357', close: '4.529', timestamp: '1642000103204',
// }, {
//   currency: 'USD/TRY', rate: '13.6127', bid: '13.6127', ask: '13.6327', high: '13.8443', low: '13.4997', open: '13.7575', close: '13.6127', timestamp: '1642000122985',
// }, {
//   currency: 'EUR/NOK', rate: '9.917', bid: '9.917', ask: '9.927', high: '9.9713', low: '9.9058', open: '9.9639', close: '9.917', timestamp: '1642000122054',
// }, {
//   currency: 'EUR/SEK', rate: '10.2339', bid: '10.2339', ask: '10.2419', high: '10.2828', low: '10.2289', open: '10.2658', close: '10.2339', timestamp: '1642000122331',
// }, {
//   currency: 'EUR/ZAR', rate: '17.5661', bid: '17.5661', ask: '17.5811', high: '17.6603', low: '17.5002', open: '17.6393', close: '17.5661', timestamp: '1642000122893',
// }, {
//   currency: 'USD/PLN', rate: '3.9668', bid: '3.9668', ask: '3.9686', high: '3.9989', low: '3.9661', open: '3.9914', close: '3.9668', timestamp: '1642000122875',
// }, {
//   currency: 'USD/ZAR', rate: '15.3851', bid: '15.3851', ask: '15.4001', high: '15.5478', low: '15.3456', open: '15.516', close: '15.3851', timestamp: '1642000121952',
// }, {
//   currency: 'EUR/TRY', rate: '15.5474', bid: '15.5474', ask: '15.5774', high: '15.7454', low: '15.3088', open: '15.6391', close: '15.5474', timestamp: '1642000122988',
// }, {
//   currency: 'USD/NOK', rate: '8.6859', bid: '8.6859', ask: '8.6959', high: '8.7758', low: '8.6802', open: '8.7672', close: '8.6859', timestamp: '1642000122983',
// }, {
//   currency: 'USD/RUB', rate: '74.5969', bid: '74.5969', ask: '74.6569', high: '74.7135', low: '74.346', open: '74.4829', close: '74.5969', timestamp: '1642000122334',
// }, {
//   currency: 'EUR/HUF', rate: '355.65', bid: '355.65', ask: '355.85', high: '357.17', low: '355.29', open: '356.69', close: '355.65', timestamp: '1642000030589',
// }, {
//   currency: 'GBP/SEK', rate: '12.2727', bid: '12.2727', ask: '12.2807', high: '12.3309', low: '12.2625', open: '12.3156', close: '12.2727', timestamp: '1642000122898',
// }, {
//   currency: 'CHF/HUF', rate: '339.06', bid: '339.06', ask: '339.53', high: '340.16', low: '338.42', open: '339.94', close: '339.06', timestamp: '1642000122946',
// }, {
//   currency: 'EUR/RUB', rate: '85.1691', bid: '85.1691', ask: '85.2391', high: '85.2442', low: '84.524', open: '84.6423', close: '85.1691', timestamp: '1642000122904',
// }, {
//   currency: 'GBP/SGD', rate: '1.8451', bid: '1.8451', ask: '1.8466', high: '1.8453', low: '1.8396', open: '1.8405', close: '1.8451', timestamp: '1642000094299',
// }, {
//   currency: 'EUR/DKK', rate: '7.4397', bid: '7.4397', ask: '7.4412', high: '7.4419', low: '7.4395', open: '7.4417', close: '7.4397', timestamp: '1642000049037',
// }, {
//   currency: 'USD/HKD', rate: '7.7947', bid: '7.7947', ask: '7.7955', high: '7.7976', low: '7.7947', open: '7.795', close: '7.7947', timestamp: '1641934738077',
// }, {
//   currency: 'EUR/ILS', rate: '3.5384', bid: '3.5384', ask: '3.5404', high: '3.5449', low: '3.5308', open: '3.533', close: '3.5384', timestamp: '1642000118741',
// }, {
//   currency: 'GBP/ILS', rate: '4.2419', bid: '4.2419', ask: '4.2459', high: '4.2499', low: '4.2349', open: '4.2384', close: '4.2419', timestamp: '1642000115232',
// }, {
//   currency: 'USD/ILS', rate: '3.0995', bid: '3.0995', ask: '3.101', high: '3.1187', low: '3.0978', open: '3.1061', close: '3.0995', timestamp: '1642000117868',
// }, {
//   currency: 'USDINR-e', rate: '72.703', bid: '72.703', ask: '72.953', high: '73.041', low: '72.686', open: '72.855', close: '72.703', timestamp: '1622836801309',
// }, {
//   currency: 'US_30', rate: '36309.0', bid: '36309.0', ask: '36313.0', high: '36328.0', low: '36085.0', open: '36122.0', close: '36309.0', timestamp: '1642000123343',
// }, {
//   currency: 'US_500', rate: '4735.25', bid: '4735.25', ask: '4735.75', high: '4736.25', low: '4695.0', open: '4704.0', close: '4735.25', timestamp: '1642000121242',
// }, {
//   currency: 'US_2000', rate: '2198.2', bid: '2198.2', ask: '2198.5', high: '2209.0', low: '2186.5', open: '2190.2', close: '2198.2', timestamp: '1642000123313',
// }, {
//   currency: 'US_TECH100', rate: '15979.0', bid: '15979.0', ask: '15980.25', high: '15991.25', low: '15762.25', open: '15818.75', close: '15979.0', timestamp: '1642000123335',
// }, {
//   currency: 'INDIA50', rate: '18339.5', bid: '18339.5', ask: '18344.5', high: '18355.0', low: '18166.5', open: '18197.5', close: '18339.5', timestamp: '1642000121917',
// }, {
//   currency: 'FTSE100', rate: '7500.5', bid: '7500.5', ask: '7502.0', high: '7505.5', low: '7454.0', open: '7466.5', close: '7500.5', timestamp: '1642000123264',
// }, {
//   currency: 'CHINA_A50', rate: '15537.5', bid: '15537.5', ask: '15550.0', high: '15565.0', low: '15370.0', open: '15387.5', close: '15537.5', timestamp: '1642000120794',
// }, {
//   currency: '#GOOGLE', rate: '2843.9', bid: '2843.9', ask: '2847.55', high: '2845.37', low: '2811.65', open: '2821.35', close: '2843.9', timestamp: '1642000123864',
// }, {
//   currency: 'NIKKEI225', rate: '28770.0', bid: '28770.0', ask: '28780.0', high: '28785.0', low: '28445.0', open: '28460.0', close: '28770.0', timestamp: '1642000110686',
// }, {
//   currency: 'SPAIN35', rate: '8776.0', bid: '8776.0', ask: '8779.0', high: '8815.0', low: '8745.0', open: '8800.0', close: '8776.0', timestamp: '1642000118458',
// }, {
//   currency: 'CAC40', rate: '7238.5', bid: '7238.5', ask: '7240.0', high: '7247.5', low: '7179.0', open: '7232.5', close: '7238.5', timestamp: '1642000122806',
// }, {
//   currency: 'DAX30', rate: '16022.5', bid: '16022.5', ask: '16024.5', high: '16064.5', low: '15937.5', open: '15995.5', close: '16022.5', timestamp: '1642000122913',
// }, {
//   currency: '#APPLE', rate: '176.5', bid: '176.5', ask: '176.83', high: '176.61', low: '175.14', open: '175.9', close: '176.5', timestamp: '1642000123354',
// }, {
//   currency: 'CORN', rate: '597.5', bid: '597.5', ask: '598.25', high: '602.0', low: '597.0', open: '601.0', close: '597.5', timestamp: '1642000119731',
// }, {
//   currency: 'COPPER', rate: '4.5585', bid: '4.5585', ask: '4.5645', high: '4.581', low: '4.4175', open: '4.4225', close: '4.5585', timestamp: '1642000121867',
// }, {
//   currency: 'WHEAT', rate: '763.75', bid: '763.75', ask: '764.5', high: '769.5', low: '762.5', open: '767.75', close: '763.75', timestamp: '1642000099767',
// }, {
//   currency: 'GOLD', rate: '1823.1', bid: '1823.1', ask: '1823.44', high: '1825.29', low: '1814.6', open: '1820.48', close: '1823.1', timestamp: '1642000122980',
// }, {
//   currency: 'SILVER', rate: '23.025', bid: '23.025', ask: '23.054', high: '23.062', low: '22.634', open: '22.741', close: '23.025', timestamp: '1642000123380',
// }, {
//   currency: 'CrudeOIL', rate: '82.17', bid: '82.17', ask: '82.2', high: '82.39', low: '81.15', open: '81.28', close: '82.17', timestamp: '1642000122090',
// }, {
//   currency: 'GASOLINE', rate: '2.3666', bid: '2.3666', ask: '2.3686', high: '2.3772', low: '2.3431', open: '2.3448', close: '2.3666', timestamp: '1642000123399',
// }, {
//   currency: 'BRENT_OIL', rate: '84.24', bid: '84.24', ask: '84.29', high: '84.47', low: '83.5', open: '83.73', close: '84.24', timestamp: '1642000122800',
// }, {
//   currency: 'NATURAL_GAS', rate: '4.602', bid: '4.602', ask: '4.606', high: '4.616', low: '4.184', open: '4.213', close: '4.602', timestamp: '1642000120252',
// }, {
//   currency: '#MICROSOFT', rate: '322.45', bid: '322.45', ask: '322.81', high: '322.55', low: '317.99', open: '319.5', close: '322.45', timestamp: '1642000123305',
// }, {
//   currency: '#INTEL', rate: '55.64', bid: '55.64', ask: '55.73', high: '56.24', low: '55.49', open: '56.05', close: '55.64', timestamp: '1642000121345',
// }, {
//   currency: '#AMAZON', rate: '3324.17', bid: '3324.17', ask: '3328.66', high: '3330.98', low: '3303.41', open: '3328.81', close: '3324.17', timestamp: '1642000123258',
// }, {
//   currency: '#CISCO', rate: '62.55', bid: '62.55', ask: '62.62', high: '62.78', low: '62.38', open: '62.38', close: '62.55', timestamp: '1642000103657',
// }, {
//   currency: '#CITIGROUP', rate: '67.32', bid: '67.32', ask: '67.42', high: '68.57', low: '67.29', open: '67.47', close: '67.32', timestamp: '1642000119728',
// }, {
//   currency: '#COCA-COLA', rate: '58.64', bid: '58.64', ask: '58.82', high: '58.9', low: '58.12', open: '58.12', close: '58.64', timestamp: '1642000113214',
// }, {
//   currency: '#JP_MORGAN', rate: '168.48', bid: '168.48', ask: '168.66', high: '169.5', low: '167.43', open: '167.54', close: '168.48', timestamp: '1642000121889',
// }, {
//   currency: '#MCDONALDS', rate: '262.71', bid: '262.71', ask: '263.15', high: '263.33', low: '261.88', open: '262.19', close: '262.71', timestamp: '1642000120258',
// }, {
//   currency: '#GE', rate: '102.28', bid: '102.28', ask: '102.36', high: '102.56', low: '100.78', open: '100.78', close: '102.28', timestamp: '1642000108281',
// }, {
//   currency: '#GM', rate: '61.21', bid: '61.21', ask: '61.28', high: '62.65', low: '61.03', open: '62.08', close: '61.21', timestamp: '1642000120854',
// }, {
//   currency: '#TESLA', rate: '1089.27', bid: '1089.27', ask: '1091.62', high: '1090.89', low: '1071.64', open: '1077.13', close: '1089.27', timestamp: '1642000123330',
// }, {
//   currency: '#AT\u0026T', rate: '26.34', bid: '26.34', ask: '26.39', high: '26.45', low: '26.13', open: '26.26', close: '26.34', timestamp: '1642000092609',
// }, {
//   currency: '#TWITTER', rate: '40.66', bid: '40.66', ask: '40.8', high: '41.4', low: '40.37', open: '40.37', close: '40.66', timestamp: '1642000123296',
// }, {
//   currency: '#ALIBABA', rate: '136.27', bid: '136.27', ask: '136.93', high: '138.35', low: '135.69', open: '135.77', close: '136.27', timestamp: '1642000123346',
// }, {
//   currency: '#GDX', rate: '31.16', bid: '31.16', ask: '31.23', high: '31.52', low: '31.11', open: '31.24', close: '31.16', timestamp: '1642000112786',
// }, {
//   currency: 'HEATING_OIL', rate: '2.5734', bid: '2.5734', ask: '2.5754', high: '2.5992', low: '2.561', open: '2.5617', close: '2.5734', timestamp: '1642000123002',
// }, {
//   currency: 'LTC_Mini', rate: '137.26', bid: '137.26', ask: '137.95', high: '137.29', low: '130.64', open: '131.3', close: '137.26', timestamp: '1642000123291',
// }, {
//   currency: 'PLATINUM', rate: '980.4', bid: '980.4', ask: '981.8', high: '982.4', low: '960.9', open: '965.5', close: '980.4', timestamp: '1642000122340',
// }, {
//   currency: 'PALLADIUM', rate: '1938.7', bid: '1938.7', ask: '1941.35', high: '1945.7', low: '1893.2', open: '1912.7', close: '1938.7', timestamp: '1642000121227',
// }, {
//   currency: 'SPI200', rate: '7350.0', bid: '7350.0', ask: '7354.0', high: '7370.0', low: '7324.0', open: '7361.0', close: '7350.0', timestamp: '1642000120859',
// }, {
//   currency: '_BARCLAYS', rate: '211.35', bid: '211.35', ask: '211.7', high: '212.0', low: '207.1', open: '207.1', close: '211.35', timestamp: '1642000119235',
// }, {
//   currency: '_SIEMENS', rate: '152.811', bid: '152.811', ask: '153.009', high: '153.131', low: '151.131', open: '151.751', close: '152.811', timestamp: '1642000122076',
// }, {
//   currency: '_BMW.DE', rate: '98.438', bid: '98.438', ask: '98.592', high: '98.838', low: '97.388', open: '98.428', close: '98.438', timestamp: '1642000120246',
// }, {
//   currency: 'OMX30', rate: '2403.0', bid: '2403.0', ask: '2403.75', high: '2403.75', low: '2373.75', open: '2394.75', close: '2403.0', timestamp: '1642000117215',
// }, {
//   currency: 'SOYBEAN', rate: '1380.25', bid: '1380.25', ask: '1381.75', high: '1390.5', low: '1378.0', open: '1384.25', close: '1380.25', timestamp: '1642000121878',
// }, {
//   currency: 'DOLLAR_INDX', rate: '95.175', bid: '95.175', ask: '95.21', high: '95.675', low: '95.155', open: '95.555', close: '95.175', timestamp: '1642000121899',
// }, {
//   currency: 'JAPAN_BOND', rate: '150.97', bid: '150.97', ask: '151.05', high: '151.04', low: '150.84', open: '150.85', close: '150.97', timestamp: '1641999940169',
// }, {
//   currency: 'COTTON#2', rate: '117.58', bid: '117.58', ask: '117.67', high: '117.84', low: '115.67', open: '115.77', close: '117.58', timestamp: '1642000113696',
// }, {
//   currency: 'HSI', rate: '24450.0', bid: '24450.0', ask: '24461.0', high: '24563.0', low: '23948.0', open: '23992.0', close: '24450.0', timestamp: '1642000123371',
// }, {
//   currency: 'FTSEMIB40', rate: '27575.0', bid: '27575.0', ask: '27585.0', high: '27600.0', low: '27380.0', open: '27550.0', close: '27575.0', timestamp: '1642000121338',
// }, {
//   currency: 'AEX', rate: '793.2', bid: '793.2', ask: '793.4', high: '793.55', low: '785.25', open: '790.15', close: '793.2', timestamp: '1642000123339',
// }, {
//   currency: 'DJ_EUR50', rate: '4312.0', bid: '4312.0', ask: '4314.0', high: '4316.0', low: '4276.0', open: '4299.0', close: '4312.0', timestamp: '1642000117879',
// }, {
//   currency: 'EURO-BUND', rate: '170.28', bid: '170.28', ask: '170.32', high: '170.5', low: '169.73', open: '169.89', close: '170.28', timestamp: '1642000115300',
// }, {
//   currency: '_ACA.FR', rate: '13.831', bid: '13.831', ask: '13.857', high: '13.849', low: '13.489', open: '13.489', close: '13.831', timestamp: '1642000116702',
// }, {
//   currency: 'SUGAR#11', rate: '18.32', bid: '18.32', ask: '18.35', high: '18.45', low: '18.14', open: '18.16', close: '18.32', timestamp: '1642000119271',
// }, {
//   currency: 'COFFEE_C', rate: '242.5', bid: '242.5', ask: '242.8', high: '244.65', low: '238.0', open: '238.3', close: '242.5', timestamp: '1642000123301',
// }, {
//   currency: 'COCOA', rate: '2574.0', bid: '2574.0', ask: '2582.0', high: '2606.0', low: '2566.0', open: '2588.0', close: '2574.0', timestamp: '1642000122792',
// }, {
//   currency: 'USD/CLP', rate: '825.68', bid: '825.68', ask: '826.33', high: '829.03', low: '824.75', open: '825.18', close: '825.68', timestamp: '1642000107727',
// }, {
//   currency: '#EEM', rate: '50.59', bid: '50.59', ask: '50.68', high: '50.73', low: '50.54', open: '50.59', close: '50.59', timestamp: '1642000118758',
// }, {
//   currency: '#GS', rate: '399.41', bid: '399.41', ask: '399.98', high: '403.76', low: '396.09', open: '402.22', close: '399.41', timestamp: '1642000122970',
// }, {
//   currency: '#BOA', rate: '48.84', bid: '48.84', ask: '48.88', high: '49.36', low: '48.7', open: '48.97', close: '48.84', timestamp: '1642000116189',
// }, {
//   currency: '#BOEING', rate: '220.53', bid: '220.53', ask: '220.97', high: '221.03', low: '216.08', open: '216.81', close: '220.53', timestamp: '1642000123270',
// }, {
//   currency: '#MASTERCARD', rate: '371.01', bid: '371.01', ask: '371.53', high: '371.86', low: '366.81', open: '367.97', close: '371.01', timestamp: '1642000121314',
// }, {
//   currency: '#PFIZER', rate: '56.13', bid: '56.13', ask: '56.19', high: '56.59', low: '55.88', open: '56.14', close: '56.13', timestamp: '1642000122937',
// }, {
//   currency: '#NETFLIX', rate: '540.87', bid: '540.87', ask: '542.3', high: '543.42', low: '538.11', open: '543.28', close: '540.87', timestamp: '1642000121976',
// }, {
//   currency: '#WAL_MART', rate: '143.64', bid: '143.64', ask: '143.85', high: '143.82', low: '143.31', open: '143.55', close: '143.64', timestamp: '1642000120225',
// }, {
//   currency: '#XLE', rate: '63.41', bid: '63.41', ask: '63.68', high: '63.6', low: '63.02', open: '63.35', close: '63.41', timestamp: '1642000121979',
// }, {
//   currency: '#CHEVRON', rate: '128.02', bid: '128.02', ask: '128.16', high: '128.27', low: '127.19', open: '127.19', close: '128.02', timestamp: '1642000122243',
// }, {
//   currency: '#EWZ', rate: '28.37', bid: '28.37', ask: '28.58', high: '28.48', low: '28.29', open: '28.29', close: '28.37', timestamp: '1642000098774',
// }, {
//   currency: '#GROUPON', rate: '23.1', bid: '23.1', ask: '23.5', high: '23.57', low: '23.06', open: '23.28', close: '23.1', timestamp: '1642000122348',
// }, {
//   currency: '#VISA', rate: '216.4', bid: '216.4', ask: '216.69', high: '216.91', low: '213.69', open: '214.24', close: '216.4', timestamp: '1642000122319',
// }, {
//   currency: '#SNAPCHAT', rate: '43.5', bid: '43.5', ask: '43.61', high: '44.28', low: '42.94', open: '43.66', close: '43.5', timestamp: '1642000123326',
// }, {
//   currency: '#BERKSHIRE', rate: '318.63', bid: '318.63', ask: '318.99', high: '320.77', low: '317.12', open: '320.02', close: '318.63', timestamp: '1642000122083',
// }, {
//   currency: '#AMERICAN_E', rate: '175.45', bid: '175.45', ask: '175.71', high: '176.68', low: '174.93', open: '174.93', close: '175.45', timestamp: '1642000116196',
// }, {
//   currency: '#EXXONMOBIL', rate: '71.19', bid: '71.19', ask: '71.26', high: '71.76', low: '71.06', open: '71.09', close: '71.19', timestamp: '1642000121985',
// }, {
//   currency: '#DISNEY', rate: '157.52', bid: '157.52', ask: '157.75', high: '158.8', low: '157.15', open: '158.28', close: '157.52', timestamp: '1642000123874',
// }, {
//   currency: '#PG', rate: '158.49', bid: '158.49', ask: '158.68', high: '158.74', low: '157.74', open: '158.05', close: '158.49', timestamp: '1642000121290',
// }, {
//   currency: '#JNJ', rate: '168.51', bid: '168.51', ask: '168.75', high: '169.84', low: '168.45', open: '169.42', close: '168.51', timestamp: '1642000123386',
// }, {
//   currency: '#TEVA', rate: '9.08', bid: '9.08', ask: '9.11', high: '9.21', low: '9.07', open: '9.1', close: '9.08', timestamp: '1642000097753',
// }, {
//   currency: '#CAT', rate: '221.83', bid: '221.83', ask: '222.27', high: '223.48', low: '220.17', open: '220.17', close: '221.83', timestamp: '1642000117873',
// }, {
//   currency: 'SMI', rate: '12602.0', bid: '12602.0', ask: '12605.0', high: '12668.0', low: '12512.0', open: '12657.0', close: '12602.0', timestamp: '1642000123350',
// }, {
//   currency: '_DEUTSCHE_B', rate: '12.202', bid: '12.202', ask: '12.226', high: '12.43', low: '12.202', open: '12.39', close: '12.202', timestamp: '1642000116717',
// }, {
//   currency: '_DAI.DE', rate: '73.807', bid: '73.807', ask: '73.943', high: '73.857', low: '72.347', open: '73.327', close: '73.807', timestamp: '1642000121972',
// }, {
//   currency: '_E.ON', rate: '11.915', bid: '11.915', ask: '11.945', high: '12.043', low: '11.803', open: '11.999', close: '11.915', timestamp: '1642000122975',
// }, {
//   currency: '_BAYER', rate: '51.095', bid: '51.095', ask: '51.335', high: '51.745', low: '50.945', open: '51.665', close: '51.095', timestamp: '1642000118765',
// }, {
//   currency: '_TOTAL', rate: '48.955', bid: '48.955', ask: '49.03', high: '48.955', low: '47.355', open: '47.355', close: '48.955', timestamp: '1642000086223',
// }, {
//   currency: '_INTESA_SAN', rate: '2.523', bid: '2.523', ask: '2.527', high: '2.5245', low: '2.4775', open: '2.4775', close: '2.523', timestamp: '1642000122998',
// }, {
//   currency: '_VK.FR', rate: '8.671', bid: '8.671', ask: '8.689', high: '8.781', low: '8.491', open: '8.696', close: '8.671', timestamp: '1642000087443',
// }, {
//   currency: '_UNICREDITO', rate: '13.5707', bid: '13.5707', ask: '13.5933', high: '14.0567', low: '13.5027', open: '14.0427', close: '13.5707', timestamp: '1642000116814',
// }, {
//   currency: '_TELECOM_IT', rate: '0.4483', bid: '0.4483', ask: '0.4493', high: '0.453', low: '0.4466', open: '0.4503', close: '0.4483', timestamp: '1642000111850',
// }, {
//   currency: '_SPM.IT', rate: '1.9968', bid: '1.9968', ask: '2.0017', high: '2.0123', low: '1.9808', open: '1.9908', close: '1.9968', timestamp: '1642000120877',
// }, {
//   currency: '_SAP.DE', rate: '122.385', bid: '122.385', ask: '122.575', high: '123.325', low: '121.685', open: '123.105', close: '122.385', timestamp: '1642000122322',
// }, {
//   currency: '_RWE.DE', rate: '35.19', bid: '35.19', ask: '35.25', high: '35.51', low: '34.87', open: '34.96', close: '35.19', timestamp: '1642000114400',
// }, {
//   currency: '_TESCO.UK', rate: '291.78', bid: '291.78', ask: '292.12', high: '295.68', low: '289.08', open: '293.23', close: '291.78', timestamp: '1642000111854',
// }, {
//   currency: '_RIO.UK', rate: '5487.68', bid: '5487.68', ask: '5495.32', high: '5506.68', low: '5304.32', open: '5304.32', close: '5487.68', timestamp: '1642000123276',
// }, {
//   currency: '#FACEBOOK', rate: '333.96', bid: '333.96', ask: '334.52', high: '336.02', low: '332.32', open: '334.68', close: '333.96', timestamp: '1642000123383',
// }, {
//   currency: 'ETHUSD', rate: '3364.57', bid: '3364.57', ask: '3387.86', high: '3372.49', low: '3195.1', open: '3228.83', close: '3364.57', timestamp: '1642000123393',
// }, {
//   currency: 'ETCUSD', rate: '30.689', bid: '30.689', ask: '31.079', high: '30.81', low: '29.357', open: '29.476', close: '30.689', timestamp: '1642000120883',
// }, {
//   currency: 'ADAUSD', rate: '1.259', bid: '1.259', ask: '1.299', high: '1.262', low: '1.167', open: '1.167', close: '1.259', timestamp: '1642000121925',
// }, {
//   currency: 'DOTUSD', rate: '27.066', bid: '27.066', ask: '27.504', high: '27.177', low: '25.239', open: '25.339', close: '27.066', timestamp: '1642000123396',
// }, {
//   currency: 'USB10YUSD-e', rate: '133.266', bid: '133.266', ask: '133.292', high: '133.282', low: '132.625', open: '132.677', close: '133.266', timestamp: '1622840354347',
// }, {
//   currency: 'USD/INR', rate: '73.734', bid: '73.734', ask: '73.839', high: '73.973', low: '73.707', open: '73.745', close: '73.734', timestamp: '1642000030078',
// }, {
//   currency: 'DOGEUSD', rate: '0.1593', bid: '0.1593', ask: '0.1594', high: '0.1595', low: '0.1511', open: '0.1536', close: '0.1593', timestamp: '1642000120221',
// }, {
//   currency: 'USD/AED', rate: '3.67317', bid: '3.67299', ask: '3.673357', high: 'n/a', low: 'n/a', open: '3.67317', close: 'n/a', timestamp: '1642000118987',
// }, {
//   currency: 'USD/ANG', rate: '1.79744', bid: '1.797353', ask: '1.7975327', high: 'n/a', low: 'n/a', open: '1.79744', close: 'n/a', timestamp: '1642000118990',
// }, {
//   currency: 'USD/ARS', rate: '103.52608', bid: '103.5209', ask: '103.53125', high: 'n/a', low: 'n/a', open: '103.52608', close: 'n/a', timestamp: '1642000118994',
// }, {
//   currency: 'USD/AUD', rate: '1.38832', bid: '1.388255', ask: '1.3883938', high: 'n/a', low: 'n/a', open: '1.38832', close: 'n/a', timestamp: '1642000118997',
// }, {
//   currency: 'USD/BDT', rate: '85.74189', bid: '85.7376', ask: '85.74617', high: 'n/a', low: 'n/a', open: '85.74189', close: 'n/a', timestamp: '1642000119001',
// }, {
//   currency: 'USD/BGN', rate: '1.7198', bid: '1.71971', ask: '1.719882', high: 'n/a', low: 'n/a', open: '1.7198', close: 'n/a', timestamp: '1642000119004',
// }, {
//   currency: 'USD/BHD', rate: '0.37702', bid: '0.3770047', ask: '0.3770424', high: 'n/a', low: 'n/a', open: '0.37702', close: 'n/a', timestamp: '1642000119008',
// }, {
//   currency: 'USD/BND', rate: '1.3496', bid: '1.349534', ask: '1.349669', high: 'n/a', low: 'n/a', open: '1.3496', close: 'n/a', timestamp: '1642000119011',
// }, {
//   currency: 'USD/BOB', rate: '6.86633', bid: '6.865988', ask: '6.8666746', high: 'n/a', low: 'n/a', open: '6.86633', close: 'n/a', timestamp: '1642000119015',
// }, {
//   currency: 'USD/BRL', rate: '5.56918', bid: '5.5689', ask: '5.56946', high: 'n/a', low: 'n/a', open: '5.56918', close: 'n/a', timestamp: '1642000119018',
// }, {
//   currency: 'USD/BWP', rate: '11.59675', bid: '11.59617', ask: '11.59733', high: 'n/a', low: 'n/a', open: '11.59675', close: 'n/a', timestamp: '1642000119022',
// }, {
//   currency: 'USD/COP', rate: '3991.8', bid: '3991.6', ask: '3992.0', high: 'n/a', low: 'n/a', open: '3991.8', close: 'n/a', timestamp: '1642000119046',
// }, {
//   currency: 'USD/CRC', rate: '640.0148', bid: '639.9828', ask: '640.0468', high: 'n/a', low: 'n/a', open: '640.0148', close: 'n/a', timestamp: '1642000119050',
// }, {
//   currency: 'USD/CZK', rate: '21.49805', bid: '21.497', ask: '21.4991', high: 'n/a', low: 'n/a', open: '21.49805', close: 'n/a', timestamp: '1642000119053',
// }, {
//   currency: 'USD/DOP', rate: '57.48408', bid: '57.48121', ask: '57.486958', high: 'n/a', low: 'n/a', open: '57.48408', close: 'n/a', timestamp: '1642000119059',
// }, {
//   currency: 'USD/DZD', rate: '139.65628', bid: '139.6493', ask: '139.66326', high: 'n/a', low: 'n/a', open: '139.65628', close: 'n/a', timestamp: '1642000119062',
// }, {
//   currency: 'USD/EGP', rate: '15.75049', bid: '15.7497', ask: '15.75127', high: 'n/a', low: 'n/a', open: '15.75049', close: 'n/a', timestamp: '1642000119065',
// }, {
//   currency: 'USD/EUR', rate: '0.88044', bid: '0.880395', ask: '0.880483', high: 'n/a', low: 'n/a', open: '0.88044', close: 'n/a', timestamp: '1642000119068',
// }, {
//   currency: 'USD/FJD', rate: '2.12561', bid: '2.1255', ask: '2.12571', high: 'n/a', low: 'n/a', open: '2.12561', close: 'n/a', timestamp: '1642000119071',
// }, {
//   currency: 'USD/GBP', rate: '0.7339', bid: '0.733865', ask: '0.7339384', high: 'n/a', low: 'n/a', open: '0.7339', close: 'n/a', timestamp: '1642000119075',
// }, {
//   currency: 'USD/HNL', rate: '24.51982', bid: '24.51859', ask: '24.521042', high: 'n/a', low: 'n/a', open: '24.51982', close: 'n/a', timestamp: '1642000119081',
// }, {
//   currency: 'USD/HRK', rate: '6.62583', bid: '6.6255', ask: '6.62616', high: 'n/a', low: 'n/a', open: '6.62583', close: 'n/a', timestamp: '1642000119084',
// }, {
//   currency: 'USD/IDR', rate: '14322.7', bid: '14322', ask: '14323.4', high: 'n/a', low: 'n/a', open: '14322.7', close: 'n/a', timestamp: '1642000119090',
// }, {
//   currency: 'USD/JMD', rate: '153.88779', bid: '153.8801', ask: '153.89549', high: 'n/a', low: 'n/a', open: '153.88779', close: 'n/a', timestamp: '1642000119099',
// }, {
//   currency: 'USD/JOD', rate: '0.70905', bid: '0.709', ask: '0.7091', high: 'n/a', low: 'n/a', open: '0.70905', close: 'n/a', timestamp: '1642000119102',
// }, {
//   currency: 'USD/KES', rate: '113.3555', bid: '113.35', ask: '113.361', high: 'n/a', low: 'n/a', open: '113.3555', close: 'n/a', timestamp: '1642000119108',
// }, {
//   currency: 'USD/KRW', rate: '1192.8895', bid: '1192.83', ask: '1192.949', high: 'n/a', low: 'n/a', open: '1192.8895', close: 'n/a', timestamp: '1642000119119',
// }, {
//   currency: 'USD/KWD', rate: '0.3025', bid: '0.30248', ask: '0.30251', high: 'n/a', low: 'n/a', open: '0.3025', close: 'n/a', timestamp: '1642000119122',
// }, {
//   currency: 'USD/KYD', rate: '0.83108', bid: '0.831043', ask: '0.8311261', high: 'n/a', low: 'n/a', open: '0.83108', close: 'n/a', timestamp: '1642000119125',
// }, {
//   currency: 'USD/KZT', rate: '434.27662', bid: '434.2549', ask: '434.29833', high: 'n/a', low: 'n/a', open: '434.27662', close: 'n/a', timestamp: '1642000119128',
// }, {
//   currency: 'USD/LBP', rate: '1508.1604', bid: '1508.085', ask: '1508.2358', high: 'n/a', low: 'n/a', open: '1508.1604', close: 'n/a', timestamp: '1642000119131',
// }, {
//   currency: 'USD/LKR', rate: '202.32842', bid: '202.3183', ask: '202.33853', high: 'n/a', low: 'n/a', open: '202.32842', close: 'n/a', timestamp: '1642000119134',
// }, {
//   currency: 'USD/MAD', rate: '9.25597', bid: '9.2555', ask: '9.25643', high: 'n/a', low: 'n/a', open: '9.25597', close: 'n/a', timestamp: '1642000119138',
// }, {
//   currency: 'USD/MDL', rate: '17.91164', bid: '17.91074', ask: '17.912531', high: 'n/a', low: 'n/a', open: '17.91164', close: 'n/a', timestamp: '1642000119141',
// }, {
//   currency: 'USD/MKD', rate: '54.19285', bid: '54.19014', ask: '54.195559', high: 'n/a', low: 'n/a', open: '54.19285', close: 'n/a', timestamp: '1642000119144',
// }, {
//   currency: 'USD/MUR', rate: '43.552', bid: '43.55', ask: '43.554', high: 'n/a', low: 'n/a', open: '43.552', close: 'n/a', timestamp: '1642000119147',
// }, {
//   currency: 'USD/MVR', rate: '15.451', bid: '15.45', ask: '15.452', high: 'n/a', low: 'n/a', open: '15.451', close: 'n/a', timestamp: '1642000119150',
// }, {
//   currency: 'USD/MYR', rate: '4.18771', bid: '4.1875', ask: '4.18792', high: 'n/a', low: 'n/a', open: '4.18771', close: 'n/a', timestamp: '1642000119156',
// }, {
//   currency: 'USD/NAD', rate: '15.541', bid: '15.54', ask: '15.542', high: 'n/a', low: 'n/a', open: '15.541', close: 'n/a', timestamp: '1642000119160',
// }, {
//   currency: 'USD/NGN', rate: '413.62', bid: '413.6', ask: '413.64', high: 'n/a', low: 'n/a', open: '413.62', close: 'n/a', timestamp: '1642000119163',
// }, {
//   currency: 'USD/NIO', rate: '35.31006', bid: '35.30829', ask: '35.311821', high: 'n/a', low: 'n/a', open: '35.31006', close: 'n/a', timestamp: '1642000119166',
// }, {
//   currency: 'USD/NPR', rate: '117.9155', bid: '117.9096', ask: '117.92139', high: 'n/a', low: 'n/a', open: '117.9155', close: 'n/a', timestamp: '1642000119172',
// }, {
//   currency: 'USD/NZD', rate: '1.47512', bid: '1.475045', ask: '1.4751925', high: 'n/a', low: 'n/a', open: '1.47512', close: 'n/a', timestamp: '1642000119176',
// }, {
//   currency: 'USD/OMR', rate: '0.38502', bid: '0.3849991', ask: '0.3850376', high: 'n/a', low: 'n/a', open: '0.38502', close: 'n/a', timestamp: '1642000119179',
// }, {
//   currency: 'USD/PEN', rate: '3.9092', bid: '3.909', ask: '3.9094', high: 'n/a', low: 'n/a', open: '3.9092', close: 'n/a', timestamp: '1642000119182',
// }, {
//   currency: 'USD/PGK', rate: '3.50174', bid: '3.501568', ask: '3.5019182', high: 'n/a', low: 'n/a', open: '3.50174', close: 'n/a', timestamp: '1642000119186',
// }, {
//   currency: 'USD/PHP', rate: '51.20806', bid: '51.2055', ask: '51.21062', high: 'n/a', low: 'n/a', open: '51.20806', close: 'n/a', timestamp: '1642000119198',
// }, {
//   currency: 'USD/PKR', rate: '176.659', bid: '176.65', ask: '176.668', high: 'n/a', low: 'n/a', open: '176.659', close: 'n/a', timestamp: '1642000119201',
// }, {
//   currency: 'USD/PYG', rate: '6922.1271', bid: '6921.781', ask: '6922.4732', high: 'n/a', low: 'n/a', open: '6922.1271', close: 'n/a', timestamp: '1642000119208',
// }, {
//   currency: 'USD/QAR', rate: '3.6412', bid: '3.641', ask: '3.6414', high: 'n/a', low: 'n/a', open: '3.6412', close: 'n/a', timestamp: '1642000119211',
// }, {
//   currency: 'USD/RON', rate: '4.35392', bid: '4.3537', ask: '4.35414', high: 'n/a', low: 'n/a', open: '4.35392', close: 'n/a', timestamp: '1642000119215',
// }, {
//   currency: 'USD/RSD', rate: '103.5402', bid: '103.535', ask: '103.5454', high: 'n/a', low: 'n/a', open: '103.5402', close: 'n/a', timestamp: '1642000119218',
// }, {
//   currency: 'USD/SAR', rate: '3.75359', bid: '3.7534', ask: '3.75378', high: 'n/a', low: 'n/a', open: '3.75359', close: 'n/a', timestamp: '1642000119226',
// }, {
//   currency: 'USD/SCR', rate: '14.00695', bid: '14.00625', ask: '14.007651', high: 'n/a', low: 'n/a', open: '14.00695', close: 'n/a', timestamp: '1642000119229',
// }, {
//   currency: 'USD/SLL', rate: '11354.55', bid: '11354', ask: '11355.1', high: 'n/a', low: 'n/a', open: '11354.55', close: 'n/a', timestamp: '1642000119240',
// }, {
//   currency: 'USD/THB', rate: '33.45865', bid: '33.457', ask: '33.4603', high: 'n/a', low: 'n/a', open: '33.45865', close: 'n/a', timestamp: '1642000119243',
// }, {
//   currency: 'USD/TND', rate: '2.87815', bid: '2.878', ask: '2.8783', high: 'n/a', low: 'n/a', open: '2.87815', close: 'n/a', timestamp: '1642000119247',
// }, {
//   currency: 'USD/TTD', rate: '6.76944', bid: '6.7691', ask: '6.76978', high: 'n/a', low: 'n/a', open: '6.76944', close: 'n/a', timestamp: '1642000119256',
// }, {
//   currency: 'USD/TWD', rate: '27.67689', bid: '27.6755', ask: '27.67827', high: 'n/a', low: 'n/a', open: '27.67689', close: 'n/a', timestamp: '1642000119259',
// }, {
//   currency: 'USD/TZS', rate: '2300.1', bid: '2300', ask: '2300.2', high: 'n/a', low: 'n/a', open: '2300.1', close: 'n/a', timestamp: '1642000119263',
// }, {
//   currency: 'USD/UAH', rate: '27.4608', bid: '27.45943', ask: '27.462176', high: 'n/a', low: 'n/a', open: '27.4608', close: 'n/a', timestamp: '1642000119266',
// }, {
//   currency: 'USD/UGX', rate: '3520.462', bid: '3520.286', ask: '3520.638', high: 'n/a', low: 'n/a', open: '3520.462', close: 'n/a', timestamp: '1642000119270',
// }, {
//   currency: 'USD/UYU', rate: '44.4152', bid: '44.41298', ask: '44.417421', high: 'n/a', low: 'n/a', open: '44.4152', close: 'n/a', timestamp: '1642000119273',
// }, {
//   currency: 'USD/UZS', rate: '10788.8095', bid: '10788.27', ask: '10789.349', high: 'n/a', low: 'n/a', open: '10788.8095', close: 'n/a', timestamp: '1642000119286',
// }, {
//   currency: 'USD/VND', rate: '22706.15', bid: '22705', ask: '22707.3', high: 'n/a', low: 'n/a', open: '22706.15', close: 'n/a', timestamp: '1642000119289',
// }, {
//   currency: 'USD/XOF', rate: '576.94535', bid: '576.9165', ask: '576.97419', high: 'n/a', low: 'n/a', open: '576.94535', close: 'n/a', timestamp: '1642000119292',
// }, {
//   currency: 'USD/YER', rate: '250.315', bid: '250.3', ask: '250.33', high: 'n/a', low: 'n/a', open: '250.315', close: 'n/a', timestamp: '1642000119296',
// }, {
//   currency: 'USD/AFN', rate: '105.21236', bid: '105.2071', ask: '105.21762', high: 'n/a', low: 'n/a', open: '105.21236', close: 'n/a', timestamp: '1642000119302',
// }, {
//   currency: 'USD/ALL', rate: '107.03215', bid: '107.0268', ask: '107.0375', high: 'n/a', low: 'n/a', open: '107.03215', close: 'n/a', timestamp: '1642000119306',
// }, {
//   currency: 'USD/AMD', rate: '481.44467', bid: '481.4206', ask: '481.46874', high: 'n/a', low: 'n/a', open: '481.44467', close: 'n/a', timestamp: '1642000119309',
// }, {
//   currency: 'USD/AOA', rate: '550.2415', bid: '550.214', ask: '550.269', high: 'n/a', low: 'n/a', open: '550.2415', close: 'n/a', timestamp: '1642000119312',
// }, {
//   currency: 'USD/AWG', rate: '1.80059', bid: '1.8005', ask: '1.80068', high: 'n/a', low: 'n/a', open: '1.80059', close: 'n/a', timestamp: '1642000119316',
// }, {
//   currency: 'USD/AZN', rate: '1.7', bid: '1.7', ask: '1.7', high: 'n/a', low: 'n/a', open: '1.7', close: 'n/a', timestamp: '1642000119319',
// }, {
//   currency: 'USD/BAM', rate: '1.72022', bid: '1.720129', ask: '1.720301', high: 'n/a', low: 'n/a', open: '1.72022', close: 'n/a', timestamp: '1642000119322',
// }, {
//   currency: 'USD/BBD', rate: '2.01364', bid: '2.013536', ask: '2.0137374', high: 'n/a', low: 'n/a', open: '2.01364', close: 'n/a', timestamp: '1642000119325',
// }, {
//   currency: 'USD/BIF', rate: '1989.9055', bid: '1989.806', ask: '1990.005', high: 'n/a', low: 'n/a', open: '1989.9055', close: 'n/a', timestamp: '1642000119329',
// }, {
//   currency: 'USD/BMD', rate: '1.0', bid: '1', ask: '1.0', high: 'n/a', low: 'n/a', open: '1.0', close: 'n/a', timestamp: '1642000119333',
// }, {
//   currency: 'USD/BSD', rate: '0.99732', bid: '0.9972691', ask: '0.99736883', high: 'n/a', low: 'n/a', open: '0.99732', close: 'n/a', timestamp: '1642000119337',
// }, {
//   currency: 'USD/BZD', rate: '2.01029', bid: '2.010193', ask: '2.010394', high: 'n/a', low: 'n/a', open: '2.01029', close: 'n/a', timestamp: '1642000119340',
// }, {
//   currency: 'USD/CDF', rate: '2006.1', bid: '2006', ask: '2006.2', high: 'n/a', low: 'n/a', open: '2006.1', close: 'n/a', timestamp: '1642000119343',
// }, {
//   currency: 'USD/CUP', rate: '23.93531', bid: '23.93411', ask: '23.936503', high: 'n/a', low: 'n/a', open: '23.93531', close: 'n/a', timestamp: '1642000119347',
// }, {
//   currency: 'USD/CVE', rate: '96.98289', bid: '96.97804', ask: '96.987738', high: 'n/a', low: 'n/a', open: '96.98289', close: 'n/a', timestamp: '1642000119350',
// }, {
//   currency: 'USD/DJF', rate: '177.54548', bid: '177.5366', ask: '177.55435', high: 'n/a', low: 'n/a', open: '177.54548', close: 'n/a', timestamp: '1642000119354',
// }, {
//   currency: 'USD/ETB', rate: '49.49021', bid: '49.48774', ask: '49.492689', high: 'n/a', low: 'n/a', open: '49.49021', close: 'n/a', timestamp: '1642000119359',
// }, {
//   currency: 'USD/GEL', rate: '3.09', bid: '3.09', ask: '3.09', high: 'n/a', low: 'n/a', open: '3.09', close: 'n/a', timestamp: '1642000119378',
// }, {
//   currency: 'USD/GHS', rate: '6.1583', bid: '6.157993', ask: '6.1586088', high: 'n/a', low: 'n/a', open: '6.1583', close: 'n/a', timestamp: '1642000119385',
// }, {
//   currency: 'USD/GIP', rate: '0.7339', bid: '0.733865', ask: '0.7339384', high: 'n/a', low: 'n/a', open: '0.7339', close: 'n/a', timestamp: '1642000119391',
// }, {
//   currency: 'USD/GMD', rate: '52.705', bid: '52.7', ask: '52.71', high: 'n/a', low: 'n/a', open: '52.705', close: 'n/a', timestamp: '1642000119396',
// }, {
//   currency: 'USD/GNF', rate: '9080.489', bid: '9080.035', ask: '9080.943', high: 'n/a', low: 'n/a', open: '9080.489', close: 'n/a', timestamp: '1642000119400',
// }, {
//   currency: 'USD/GTQ', rate: '7.69671', bid: '7.696326', ask: '7.6970956', high: 'n/a', low: 'n/a', open: '7.69671', close: 'n/a', timestamp: '1642000119403',
// }, {
//   currency: 'USD/GYD', rate: '208.65413', bid: '208.6437', ask: '208.66456', high: 'n/a', low: 'n/a', open: '208.65413', close: 'n/a', timestamp: '1642000119406',
// }, {
//   currency: 'USD/HTG', rate: '103.05315', bid: '103.048', ask: '103.0583', high: 'n/a', low: 'n/a', open: '103.05315', close: 'n/a', timestamp: '1642000119410',
// }, {
//   currency: 'USD/IQD', rate: '1455.5858', bid: '1455.513', ask: '1455.6586', high: 'n/a', low: 'n/a', open: '1455.5858', close: 'n/a', timestamp: '1642000119413',
// }, {
//   currency: 'USD/IRR', rate: '42252.1', bid: '42250', ask: '42254.2', high: 'n/a', low: 'n/a', open: '42252.1', close: 'n/a', timestamp: '1642000119417',
// }, {
//   currency: 'USD/ISK', rate: '129.4565', bid: '129.45', ask: '129.463', high: 'n/a', low: 'n/a', open: '129.4565', close: 'n/a', timestamp: '1642000119420',
// }, {
//   currency: 'USD/KGS', rate: '84.79264', bid: '84.7884', ask: '84.79688', high: 'n/a', low: 'n/a', open: '84.79264', close: 'n/a', timestamp: '1642000119423',
// }, {
//   currency: 'USD/KHR', rate: '4076.2', bid: '4076', ask: '4076.4', high: 'n/a', low: 'n/a', open: '4076.2', close: 'n/a', timestamp: '1642000119427',
// }, {
//   currency: 'USD/KMF', rate: '433.6467', bid: '433.625', ask: '433.6684', high: 'n/a', low: 'n/a', open: '433.6467', close: 'n/a', timestamp: '1642000119430',
// }, {
//   currency: 'USD/LAK', rate: '11285.55', bid: '11285', ask: '11286.1', high: 'n/a', low: 'n/a', open: '11285.55', close: 'n/a', timestamp: '1642000119433',
// }, {
//   currency: 'USD/LRD', rate: '148.505', bid: '148.5', ask: '148.51', high: 'n/a', low: 'n/a', open: '148.505', close: 'n/a', timestamp: '1642000119437',
// }, {
//   currency: 'USD/LSL', rate: '15.6358', bid: '15.635', ask: '15.6366', high: 'n/a', low: 'n/a', open: '15.6358', close: 'n/a', timestamp: '1642000119440',
// }, {
//   currency: 'USD/LYD', rate: '4.58209', bid: '4.581862', ask: '4.5823202', high: 'n/a', low: 'n/a', open: '4.58209', close: 'n/a', timestamp: '1642000119443',
// }, {
//   currency: 'USD/MMK', rate: '1773.20965', bid: '1773.121', ask: '1773.2983', high: 'n/a', low: 'n/a', open: '1773.20965', close: 'n/a', timestamp: '1642000119447',
// }, {
//   currency: 'USD/MOP', rate: '8.00909', bid: '8.008689', ask: '8.0094899', high: 'n/a', low: 'n/a', open: '8.00909', close: 'n/a', timestamp: '1642000119450',
// }, {
//   currency: 'USD/MWK', rate: '809.85179', bid: '809.8113', ask: '809.89228', high: 'n/a', low: 'n/a', open: '809.85179', close: 'n/a', timestamp: '1642000119453',
// }, {
//   currency: 'USD/MZN', rate: '63.833', bid: '63.83', ask: '63.836', high: 'n/a', low: 'n/a', open: '63.833', close: 'n/a', timestamp: '1642000119457',
// }, {
//   currency: 'USD/PAB', rate: '0.9973', bid: '0.9972516', ask: '0.99735133', high: 'n/a', low: 'n/a', open: '0.9973', close: 'n/a', timestamp: '1642000119468',
// }, {
//   currency: 'USD/RWF', rate: '1035.02075', bid: '1034.969', ask: '1035.0725', high: 'n/a', low: 'n/a', open: '1035.02075', close: 'n/a', timestamp: '1642000119471',
// }, {
//   currency: 'USD/SBD', rate: '8.08128', bid: '8.080873', ask: '8.0816811', high: 'n/a', low: 'n/a', open: '8.08128', close: 'n/a', timestamp: '1642000119475',
// }, {
//   currency: 'USD/SDG', rate: '437.52', bid: '437.5', ask: '437.54', high: 'n/a', low: 'n/a', open: '437.52', close: 'n/a', timestamp: '1642000119478',
// }, {
//   currency: 'USD/SOS', rate: '585.05', bid: '585', ask: '585.1', high: 'n/a', low: 'n/a', open: '585.05', close: 'n/a', timestamp: '1642000119481',
// }, {
//   currency: 'USD/SRD', rate: '21.23356', bid: '21.2325', ask: '21.23462', high: 'n/a', low: 'n/a', open: '21.23356', close: 'n/a', timestamp: '1642000119484',
// }, {
//   currency: 'USD/SVC', rate: '8.72687', bid: '8.726435', ask: '8.7273076', high: 'n/a', low: 'n/a', open: '8.72687', close: 'n/a', timestamp: '1642000119488',
// }, {
//   currency: 'USD/SZL', rate: '15.55251', bid: '15.55173', ask: '15.553285', high: 'n/a', low: 'n/a', open: '15.55251', close: 'n/a', timestamp: '1642000119491',
// }, {
//   currency: 'USD/TJS', rate: '11.25955', bid: '11.259', ask: '11.2601', high: 'n/a', low: 'n/a', open: '11.25955', close: 'n/a', timestamp: '1642000119494',
// }, {
//   currency: 'USD/TMT', rate: '3.5', bid: '3.5', ask: '3.5', high: 'n/a', low: 'n/a', open: '3.5', close: 'n/a', timestamp: '1642000119497',
// }, {
//   currency: 'USD/TOP', rate: '2.27992', bid: '2.2798', ask: '2.28003', high: 'n/a', low: 'n/a', open: '2.27992', close: 'n/a', timestamp: '1642000119500',
// }, {
//   currency: 'USD/XAF', rate: '576.97335', bid: '576.9445', ask: '577.00219', high: 'n/a', low: 'n/a', open: '576.97335', close: 'n/a', timestamp: '1642000119504',
// }, {
//   currency: 'USD/XCD', rate: '2.70269', bid: '2.70255', ask: '2.70282', high: 'n/a', low: 'n/a', open: '2.70269', close: 'n/a', timestamp: '1642000119507',
// }, {
//   currency: 'USD/ZMW', rate: '16.86445', bid: '16.8636', ask: '16.86529', high: 'n/a', low: 'n/a', open: '16.86445', close: 'n/a', timestamp: '1642000119510',
// }, {
//   currency: 'TRY/JPY', rate: '8.4455', bid: '8.437', ask: '8.454', high: '8.575', low: '8.23', open: '8.346', close: 'n/a', timestamp: '1642000119788',
// }, {
//   currency: 'USD/CNH', rate: '6.36339', bid: '6.36332', ask: '6.36345', high: '6.37816', low: '6.36126', open: '6.36993', close: 'n/a', timestamp: '1642000119791',
// }, {
//   currency: 'AUS200', rate: '7442.34', bid: '7440.44', ask: '7444.24', high: '7470.28', low: '7419.79', open: '7445.91', close: 'n/a', timestamp: '1642000119795',
// }, {
//   currency: 'ESP35', rate: '8781.55', bid: '8777.55', ask: '8785.55', high: '8826.81', low: '8747.03', open: '8789.09', close: 'n/a', timestamp: '1642000119798',
// }, {
//   currency: 'FRA40', rate: '7240.45', bid: '7239.95', ask: '7240.95', high: '7249.85', low: '7181.24', open: '7230.18', close: 'n/a', timestamp: '1642000119802',
// }, {
//   currency: 'GER30', rate: '16036.2', bid: '16035.55', ask: '16036.85', high: '16080.6', low: '15951.83', open: '16039.22', close: 'n/a', timestamp: '1642000119806',
// }, {
//   currency: 'HKG33', rate: '24444.91', bid: '24440.41', ask: '24449.41', high: '24569.27', low: '23946.86', open: '24319.45', close: 'n/a', timestamp: '1642000119809',
// }, {
//   currency: 'JPN225', rate: '28820.82', bid: '28815.82', ask: '28825.82', high: '28845.53', low: '28453.98', open: '28749.98', close: 'n/a', timestamp: '1642000119813',
// }, {
//   currency: 'NAS100', rate: '15991.62', bid: '15990.97', ask: '15992.27', high: '16012.12', low: '15782.6', open: '15877.12', close: 'n/a', timestamp: '1642000119816',
// }, {
//   currency: 'SPX500', rate: '4746.26', bid: '4746.01', ask: '4746.51', high: '4748.27', low: '4706.46', open: '4721.28', close: 'n/a', timestamp: '1642000119829',
// }, {
//   currency: 'UK100', rate: '7574.44', bid: '7573.84', ask: '7575.04', high: '7579.88', low: '7526.66', open: '7541.27', close: 'n/a', timestamp: '1642000119833',
// }, {
//   currency: 'US30', rate: '36454.48', bid: '36453.43', ask: '36455.53', high: '36473.82', low: '36228.06', open: '36309.11', close: 'n/a', timestamp: '1642000119837',
// }, {
//   currency: 'Copper', rate: '4.562', bid: '4.5595', ask: '4.5645', high: '4.58675', low: '4.4177', open: '4.50905', close: 'n/a', timestamp: '1642000119840',
// }, {
//   currency: 'CHN50', rate: '15528.37', bid: '15522.87', ask: '15533.87', high: '15561.12', low: '15356.14', open: '15472.17', close: 'n/a', timestamp: '1642000119844',
// }, {
//   currency: 'EUSTX50', rate: '4324.72', bid: '4323.77', ask: '4325.67', high: '4330.17', low: '4288.22', open: '4311.63', close: 'n/a', timestamp: '1642000119847',
// }, {
//   currency: 'VOLX', rate: '18.2', bid: '18.15', ask: '18.25', high: '19.3', low: '18.15', open: '18.925', close: 'n/a', timestamp: '1642000119850',
// }, {
//   currency: 'USDOLLAR', rate: '12129.0', bid: '12128', ask: '12130', high: '12172.7', low: '12126.9', open: '12169.7', close: 'n/a', timestamp: '1642000119853',
// }, {
//   currency: 'US2000', rate: '2202.18', bid: '2201.98', ask: '2202.38', high: '2213.16', low: '2190.21', open: '2196.46', close: 'n/a', timestamp: '1642000119857',
// }, {
//   currency: 'USOil', rate: '82.214', bid: '82.194', ask: '82.234', high: '82.42', low: '81.151', open: '81.507', close: 'n/a', timestamp: '1642000119860',
// }, {
//   currency: 'UKOil', rate: '84.316', bid: '84.286', ask: '84.346', high: '84.52', low: '83.503', open: '83.857', close: 'n/a', timestamp: '1642000119863',
// }, {
//   currency: 'SOYF', rate: '1381.2975', bid: '1380.72', ask: '1381.875', high: '1392.125', low: '1378.5', open: '1386.1975', close: 'n/a', timestamp: '1642000119866',
// }, {
//   currency: 'NGAS', rate: '4.6069', bid: '4.6009', ask: '4.6129', high: '4.6239', low: '4.1798', open: '4.3458', close: 'n/a', timestamp: '1642000119869',
// }, {
//   currency: 'WHE/ATF', rate: '764.3225', bid: '763.77', ask: '764.875', high: '770.88', low: '762.22', open: '767.41', close: 'n/a', timestamp: '1642000119872',
// }, {
//   currency: 'CORNF', rate: '597.85', bid: '597.27', ask: '598.43', high: '603.08', low: '596.85', open: '600.75', close: 'n/a', timestamp: '1642000119875',
// }, {
//   currency: 'Bund', rate: '170.288', bid: '170.26', ask: '170.316', high: '170.538', low: '169.714', open: '169.794', close: 'n/a', timestamp: '1642000119879',
// }, {
//   currency: 'XAU/USD', rate: '1822.85', bid: '1822.66', ask: '1823.04', high: '1825.56', low: '1814.62', open: '1817.02', close: 'n/a', timestamp: '1642000119882',
// }, {
//   currency: 'XAG/USD', rate: '23.017', bid: '22.997', ask: '23.037', high: '23.101', low: '22.629', open: '22.7165', close: 'n/a', timestamp: '1642000119885',
// }, {
//   currency: 'EMBasket', rate: '8445.8', bid: '8443.9', ask: '8447.7', high: '8456.3', low: '8392.2', open: '8399.7', close: 'n/a', timestamp: '1642000119888',
// }, {
//   currency: 'JPYBasket', rate: '8970.7', bid: '8969.2', ask: '8972.2', high: '9006.1', low: '8959', open: '8988.7', close: 'n/a', timestamp: '1642000119891',
// }, {
//   currency: 'BCH/USD', rate: '381.595', bid: '379.94', ask: '383.25', high: '384.27', low: '366.25', open: '370.07', close: 'n/a', timestamp: '1642000119897',
// }, {
//   currency: 'ETH/USD', rate: '3376.35', bid: '3373.55', ask: '3379.15', high: '3388.45', low: '3204.15', open: '3221.85', close: 'n/a', timestamp: '1642000119909',
// }, {
//   currency: 'LTC/USD', rate: '137.62', bid: '137.44', ask: '137.8', high: '137.84', low: '130.75', open: '131.955', close: 'n/a', timestamp: '1642000119912',
// }, {
//   currency: 'XRP/USD', rate: '0.4605', bid: '0.458', ask: '0.463', high: '0.463', low: '0.458', open: '0.4605', close: 'n/a', timestamp: '1642000119915',
// }, {
//   currency: 'CryptoMajor', rate: '204.498', bid: '203.498', ask: '205.498', high: '205.741', low: '194.54', open: '196.334', close: 'n/a', timestamp: '1642000119918',
// }, {
//   currency: 'EOS/USD', rate: '2.8767', bid: '2.8617', ask: '2.8917', high: '2.8965', low: '2.7427', open: '2.78025', close: 'n/a', timestamp: '1642000119921',
// }, {
//   currency: 'XLM/USD', rate: '0.27405', bid: '0.27291', ask: '0.27519', high: '0.27641', low: '0.25759', open: '0.26962', close: 'n/a', timestamp: '1642000119924',
// }, {
//   currency: 'ESPORTS', rate: '4263.9925', bid: '4262.492', ask: '4265.493', high: '4289.201', low: '4215.218', open: '4217.247', close: 'n/a', timestamp: '1642000119927',
// }, {
//   currency: 'BIOTECH', rate: '2839.125', bid: '2838.492', ask: '2839.758', high: '2860.807', low: '2837.197', open: '2859.916', close: 'n/a', timestamp: '1642000119931',
// }, {
//   currency: 'CANNABIS', rate: '2623.499', bid: '2619.836', ask: '2627.162', high: '2676.949', low: '2603.622', open: '2607.7545', close: 'n/a', timestamp: '1642000119934',
// }, {
//   currency: 'FAANG', rate: '5535.3325', bid: '5534.067', ask: '5536.598', high: '5545.542', low: '5496.603', open: '5498.499', close: 'n/a', timestamp: '1642000119937',
// }, {
//   currency: 'CHN.TECH', rate: '2844.7055', bid: '2841.539', ask: '2847.872', high: '2973.708', low: '2817.304', open: '2824.0815', close: 'n/a', timestamp: '1642000119940',
// }, {
//   currency: 'CHN.ECOMM', rate: '3529.719', bid: '3526.904', ask: '3532.534', high: '3624.26', low: '3478.623', open: '3484.497', close: 'n/a', timestamp: '1642000119943',
// }, {
//   currency: 'USEquities', rate: '3794.064', bid: '3793.064', ask: '3795.064', high: '3799.828', low: '3760.211', open: '3774.753', close: 'n/a', timestamp: '1642000119946',
// }, {
//   currency: 'BA.us', rate: '220.92', bid: '220.72', ask: '221.12', high: '221.44', low: '215.8', open: '215.96', close: 'n/a', timestamp: '1642000119949',
// }, {
//   currency: 'BAC/.us', rate: '48.855', bid: '48.79', ask: '48.92', high: '49.44', low: '48.65', open: '49.225', close: 'n/a', timestamp: '1642000119952',
// }, {
//   currency: 'DIS/.us', rate: '157.46', bid: '157.28', ask: '157.64', high: '159.16', low: '157.08', open: '157.9', close: 'n/a', timestamp: '1642000119956',
// }, {
//   currency: 'F.us', rate: '24.61', bid: '24.54', ask: '24.68', high: '24.91', low: '24.28', open: '24.345', close: 'n/a', timestamp: '1642000119959',
// }, {
//   currency: 'JPM/.us', rate: '168.695', bid: '168.51', ask: '168.88', high: '169.76', low: '167.32', open: '167.485', close: 'n/a', timestamp: '1642000119962',
// }, {
//   currency: 'PFE/.us', rate: '56.17', bid: '56.1', ask: '56.24', high: '56.76', low: '55.84', open: '56.695', close: 'n/a', timestamp: '1642000119965',
// }, {
//   currency: 'T.us', rate: '26.365', bid: '26.3', ask: '26.43', high: '26.54', low: '26.09', open: '26.345', close: 'n/a', timestamp: '1642000119968',
// }, {
//   currency: 'XOM/.us', rate: '71.215', bid: '71.15', ask: '71.28', high: '71.88', low: '71.03', open: '71.35', close: 'n/a', timestamp: '1642000119971',
// }, {
//   currency: 'AAPL.us', rate: '176.61', bid: '176.49', ask: '176.73', high: '176.9', low: '174.89', open: '175.005', close: 'n/a', timestamp: '1642000119982',
// }, {
//   currency: 'AMZN.us', rate: '3323.695', bid: '3321.7', ask: '3325.69', high: '3333.22', low: '3304.3', open: '3307.225', close: 'n/a', timestamp: '1642000119985',
// }, {
//   currency: 'FB.us', rate: '333.935', bid: '333.76', ask: '334.11', high: '336.56', low: '332.31', open: '334.395', close: 'n/a', timestamp: '1642000119988',
// }, {
//   currency: 'GOOG.us', rate: '2847.55', bid: '2846.65', ask: '2848.45', high: '2854.11', low: '2800.69', open: '2800.81', close: 'n/a', timestamp: '1642000119991',
// }, {
//   currency: 'INTC.us', rate: '55.68', bid: '55.61', ask: '55.75', high: '56.36', low: '55.46', open: '55.915', close: 'n/a', timestamp: '1642000119995',
// }, {
//   currency: 'MSFT.us', rate: '322.55', bid: '322.22', ask: '322.88', high: '322.9', low: '314.59', open: '314.905', close: 'n/a', timestamp: '1642000119998',
// }, {
//   currency: 'BNP/.fr', rate: '65.375', bid: '65.26', ask: '65.49', high: '65.75', low: '64.07', open: '64.955', close: 'n/a', timestamp: '1642000120001',
// }, {
//   currency: 'FP.fr', rate: '39.98', bid: '39.915', ask: '40.045', high: '40.045', low: '39.915', open: '39.98', close: 'n/a', timestamp: '1642000120004',
// }, {
//   currency: 'SAN/.fr', rate: '89.995', bid: '89.87', ask: '90.12', high: '91.04', low: '89.49', open: '90.29', close: 'n/a', timestamp: '1642000120007',
// }, {
//   currency: 'ADS/.de', rate: '253.625', bid: '253.24', ask: '254.01', high: '258.11', low: '250.94', open: '256.05', close: 'n/a', timestamp: '1642000120010',
// }, {
//   currency: 'ALV/.de', rate: '225.475', bid: '225.19', ask: '225.76', high: '226.86', low: '223.99', open: '225.725', close: 'n/a', timestamp: '1642000120013',
// }, {
//   currency: 'DAI/.de', rate: '73.87', bid: '73.75', ask: '73.99', high: '74.05', low: '72.3', open: '73.155', close: 'n/a', timestamp: '1642000120016',
// }, {
//   currency: 'DBK/.de', rate: '12.22', bid: '12.15', ask: '12.29', high: '12.51', low: '12.15', open: '12.39', close: 'n/a', timestamp: '1642000120019',
// }, {
//   currency: 'LHA/.de', rate: '7.195', bid: '7.13', ask: '7.26', high: '7.46', low: '7.06', open: '7.33', close: 'n/a', timestamp: '1642000120023',
// }, {
//   currency: 'SAP/.de', rate: '122.46', bid: '122.28', ask: '122.64', high: '123.74', low: '121.58', open: '123.04', close: 'n/a', timestamp: '1642000120026',
// }, {
//   currency: 'BARC.uk', rate: '211.515', bid: '210.94', ask: '212.09', high: '212.76', low: '206.04', open: '209.65', close: 'n/a', timestamp: '1642000120029',
// }, {
//   currency: 'BATS.uk', rate: '2929.01', bid: '2922.51', ask: '2935.51', high: '2953.51', low: '2863.99', open: '2913.75', close: 'n/a', timestamp: '1642000120032',
// }, {
//   currency: 'HSBA.uk', rate: '500.04', bid: '498.89', ask: '501.19', high: '501.91', low: '491.49', open: '498.15', close: 'n/a', timestamp: '1642000120035',
// }, {
//   currency: 'BABA.us', rate: '136.54', bid: '136.39', ask: '136.69', high: '138.87', low: '132.21', open: '132.32', close: 'n/a', timestamp: '1642000120038',
// }, {
//   currency: 'NFLX.us', rate: '541.075', bid: '540.83', ask: '541.32', high: '544.63', low: '538.25', open: '540.605', close: 'n/a', timestamp: '1642000120041',
// }, {
//   currency: 'TSLA.us', rate: '1090.815', bid: '1090.31', ask: '1091.32', high: '1091.85', low: '1063.94', open: '1064.205', close: 'n/a', timestamp: '1642000120044',
// }, {
//   currency: 'GLEN.uk', rate: '399.56', bid: '398.56', ask: '400.56', high: '402.91', low: '385.09', open: '392.5', close: 'n/a', timestamp: '1642000120047',
// }, {
//   currency: 'BYND.us', rate: '69.16', bid: '68.93', ask: '69.39', high: '71.39', low: '68.31', open: '69.33', close: 'n/a', timestamp: '1642000120059',
// }, {
//   currency: 'UBER.us', rate: '43.51', bid: '43.44', ask: '43.58', high: '44.01', low: '42.88', open: '43.635', close: 'n/a', timestamp: '1642000120062',
// }, {
//   currency: 'ZM.us', rate: '174.95', bid: '174.55', ask: '175.35', high: '180.22', low: '173.94', open: '176.045', close: 'n/a', timestamp: '1642000120065',
// }, {
//   currency: 'JD.us', rate: '76.965', bid: '76.83', ask: '77.1', high: '78.71', low: '75.86', open: '76.73', close: 'n/a', timestamp: '1642000120068',
// }, {
//   currency: 'NVDA.us', rate: '282.31', bid: '282', ask: '282.62', high: '284.87', low: '277.92', open: '278.185', close: 'n/a', timestamp: '1642000120071',
// }];