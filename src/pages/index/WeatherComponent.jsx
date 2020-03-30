import Taro, { Component } from '@tarojs/taro'
import Zero0 from './assets/day/00.svg';
import Zero1 from './assets/day/01.svg';
import Zero2 from './assets/day/02.svg';
import Zero3 from './assets/day/03.svg';
import Zero4 from './assets/day/04.svg';
import Zero5 from './assets/day/05.svg';
import Zero6 from './assets/day/06.svg';
import Zero7 from './assets/day/07.svg';
import Zero8 from './assets/day/08.svg';
import Zero9 from './assets/day/09.svg';
const styles = {
    iconStyle: {
        width: 20,
        height: 20
    }
};
export default class Weather extends Component {

    constructor(props) {
        super(props);
        this.state = {
            weatherCode: this.props.weatherCode
        }
    }
    render() {
        const { weatherCode } = this.state;
        return this.weatherRender(weatherCode);

    }
    weatherRender = (code) => {
        const number = code;
        const url = `./assets/day/svg/${number}.svg`;
        const httpsUrl = `https://mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/${number}.svg`;
        //console.log(httpsUrl);
        switch (code) {
            case '00':
                return <Zero0 style={styles.iconStyle} />;
            case '01':
                return <Zero1 style={styles.iconStyle} />;
            case '02':
                return <Zero2 style={styles.iconStyle} />;
            case '03':
                return <Zero3 style={styles.iconStyle} />;
            case '04':
                return <Zero4 style={styles.iconStyle} />;
            case '05':
                return <Zero5 style={styles.iconStyle} />;
            case '06':
                return <Zero6 style={styles.iconStyle} />;
            case '07':
                return <Zero7 style={styles.iconStyle} />;
            case '08':
                return <Zero8 style={styles.iconStyle} />;
            case '09':
                return <Zero9 style={styles.iconStyle} />;
            default:
                return <Zero0 style={styles.iconStyle} />;
        }
    }
}