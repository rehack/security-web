

export default class AppConfig {

    public options: any;

    public static readonly SECURITY_PARAMETER_KEY = '123456789123456';
    public static readonly SECURITY_PARAMETER_IV = '123456789123456';

    public constructor() {
       this.options = {
           COMMODITY_SERVER: '/commodity',
           ORDER_SERVER: '/order'
       }
    }

}
