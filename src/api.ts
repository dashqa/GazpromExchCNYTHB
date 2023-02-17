import axios from 'axios';
import { getPrevDate } from './utils';
import {
  UNION_PAY_RATE_URL, FOREX_RATE_URL, BASE_CUR, TRANS_CUR,
} from './config';
import { UnionPayExchangeRateType, ForexExchangeRateTypeResponse, ForexExchangeRateTypeRequest } from './types';

const instance = axios.create({
  headers: {
    Host: 'www.unionpayintl.com',
    Accept: '*/*',
    'Accept-Language': 'en-US',
    Origin: 'http://www.unionpayintl.com',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0',
    'Content-Type': 'application/x-www-form-urlencoded',
    Referer: 'https://www.unionpayintl.com/cardholderServ/serviceCenter/rate?language=en',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'no-cors',
    'Sec-Fetch-Site': 'same-origin',
    Pragma: 'no-cache',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  },
  withCredentials: true,
});

const isFilled = <T extends {}>(v: PromiseSettledResult<T>): v is PromiseFulfilledResult<T> => v.status === 'fulfilled';

const fetchUnionPayRate = async (targetDate: string): Promise<any> => {
  const jsonDate = targetDate.replace(/-/g, '');
  const response = await instance.get(`${UNION_PAY_RATE_URL}/${jsonDate}.json`);
  const { rateData } = response.data?.exchangeRateJson.find(({ baseCur, transCur }) => baseCur === BASE_CUR && transCur === TRANS_CUR);
  const { curDate } = response.data;
  return { rate: rateData, date: curDate };
};

const fetchOtherRates = async (params: ForexExchangeRateTypeRequest): Promise<ForexExchangeRateTypeResponse> => {
  const response = await axios.get(`${FOREX_RATE_URL}`, { params });
  const { base, date, rates } = response?.data;
  return { base, date, rates };
};

const getUnionPayExchangeRate = async (dateString: string): Promise<UnionPayExchangeRateType[] | void> => {
  const ratesCountNum = 2;

  const recursively = async (formattedDate: string, countNum: number): Promise<UnionPayExchangeRateType[]> => {
    try {
      const { rate, date } = await fetchUnionPayRate(formattedDate);
      if (countNum - 1 === 0) {
        return [{ rate, date }];
      }
      return [{ rate, date }, ...(await recursively(getPrevDate(date), countNum - 1))];
    } catch (error) {
      return await recursively(getPrevDate(formattedDate), countNum);
    }
  };

  return recursively(dateString, ratesCountNum);
};

const getOtherExchangeRates = async (): Promise<void | ('rejected' | Promise<ForexExchangeRateTypeResponse>[])[]> => {
  const queries = [{
    base: 'CNY',
    symbols: 'THB,RUB',
  }, {
    base: 'THB',
    symbols: 'RUB',
  }, {
    base: 'USD',
    symbols: 'THB',
  }];
  return Promise.allSettled([
    queries.map((query) => fetchOtherRates(query)),
  ]).then((results) => results.map((result) => (isFilled(result) ? result.value : result.status)))
    .catch((err) => console.log(err));
};

export { getUnionPayExchangeRate, getOtherExchangeRates };
