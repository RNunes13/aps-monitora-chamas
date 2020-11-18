
import Axios from 'axios';

export default class API {
  baseUrl = 'http://queimadas.dgi.inpe.br/queimadas/dados-abertos/api';
  instance = null;
  jsonHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  constructor() {
    this.instance = Axios.create({
      baseURL: this.baseUrl,
      headers: {
        ...this.jsonHeaders,
      },
    });
  }

  async getCounters() {
    return new Promise(async (resolve, reject) => {
      try {
        const countries = await this.getCountries();
        const { status, data } = await this.instance.get('/focos/count');
        
        if (status == 200) {
          const counters = Object
            .keys(data)
            .map(key => {
              const countryId = ((countries.filter(country => country.pais_name === key ) || [])[0] || {}).pais_id;

              return {
                id: countryId,
                name: key,
                count: data[key],
              }
            })
            .sort((a, b) => a.count > b.count ? -1 : a.count < b.count ? 1 : 0);

          resolve(counters);
        }
      } catch (error) {
        reject(error)
      }
    });
  }

  async getDataByCountry(country_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const { status, data } = await this.instance.get(`/focos?pais_id=${country_id}`);

        if (status == 200) {
          resolve(data);
        }
      } catch (error) {
        reject(error)
      }
    });
  }

  async getDataByCountryAndState(country_id, state_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const { status, data } = await this.instance.get(`/focos?pais_id=${country_id}&estado_id=${state_id}`);

        if (status == 200) {
          resolve(data);
        }
      } catch (error) {
        reject(error)
      }
    });
  }

  async getCountries() {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.instance.get('/auxiliar/paises');
        
        resolve(data);
      } catch (error) {
        reject(error)
      }
    });
  }

  async getStates(pais_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.instance.get(`/auxiliar/estados?pais_id=${pais_id}`);
        
        resolve(data);
      } catch (error) {
        reject(error)
      }
    });
  }

  async getCities(pais_id, estado_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.instance.get(`/auxiliar/municipios?pais_id=${pais_id}&estado_id=${estado_id}`);
        
        resolve(data);
      } catch (error) {
        reject(error)
      }
    });
  }
}
