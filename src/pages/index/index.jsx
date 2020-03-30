import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Swiper } from '@tarojs/components'
import moment from 'moment';
import queryString from 'query-string';
import WeatherComponent from './WeatherComponent';
import Location from './assets/images/svg/ios-pin.svg';
import CitySwtich from './CitySwitch';
import { windCode, skyLine, skyCode } from './WeatherConfig';
const SwiperItem = Swiper.SwiperItem;
//const styles = require('./index.scss');
const styles = {
  section1: {
    position: 'relative', alignItems: "center", width: '100%', paddingTop: 40
  },
  layer: {
    width: "100%",
    height: '100%',
    position: "absolute",
    bottom: 0,
    justifyContent: "flex-end",
  },
  layerImage: {
    width: '100%',
  },
  section2: {
    flex: 4,
    justifyContent: "flex-start",
    backgroundColor: 'white',
  },
  section3: {
    flex: 3,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    borderTopColor: '#cccccc',
    borderTopWidth: 1,
    backgroundColor: 'white',
  },
  lightColor: {
    color: 'white'
  },
  darkColor: {
    color: '#434343'
  },
  todayTop: {
    flex: 1,
    flexDirection: 'row',
  },
  today24hours: {
    flex: 2,
    flexDirection: 'row',
    paddingTop: 10,
  },
  weekNumberStyle: {
    fontSize: 20
  },
  degreeNumberStyle: {
    fontSize: 18
  },
  maxDegreeStyle: {
    fontSize: 18,
  },
  minDegreeStyle: {
    fontSize: 18,
    color: 'grey'
  },
  iconStyle: {
    width: 20,
    height: 20
  },
  font22: {
    fontSize: 22
  },
  font20: {
    fontSize: 20
  },
  observeTitle: {
    fontSize: 14, color: 'grey', flex: 1
  },
  observeLine: {
    paddingTop: 5, paddingBottom: 5, flexDirection: "row"
  },
  observeInfo: {
    fontSize: 20, flex: 2
  },
  borderBottom: {
    borderBottomColor: '#cccccc', borderBottomWidth: 1
  },
  windHumidity: {
    padding: 5, color: 'white', fontSize: 18
  },
  poetry: {
    padding: 5, color: 'white', fontSize: 18
  }
};
export default class Index extends Component {
  weatherCommonApi = "https://wis.qq.com/weather/common";//china weather
  weatherTouristApi = 'https://wis.qq.com/weather/tourist';//tourist weather
  weatherExternalApi = 'https://wis.qq.com/weather/external';//external weather
  geoApi = "https://apis.map.qq.com/ws/geocoder/v1/";//经纬度转换城市
  constructor(props) {
    super(props);
    this.state = {
      address_component: null,
      latitude: '29.552469',
      longitude: '106.510468',
      weatherData: null,
      searchPanel: false,
      source: 'xw',
      type: 'common', //3种天气请求类型
      day: skyLine.day.C2,
      isDay: true,//是否是白天
      scale: 2,
    }
  }
  componentWillMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  config = {
    navigationBarTitleText: '首页'
  }
  componentDidMount() {
    this.geolocation();
    // this.phoneDimension();
  }
  phoneDimension = () => {
    //const h = Dimensions.get('window').height;
  }
  geolocation = () => {
    let param = {
      key: '3BFBZ-ZKD3X-LW54A-ZT76D-E7AHO-4RBD5', location: this.state.latitude + "," + this.state.longitude
    }
    fetch(this.geoApi + `?${queryString.stringify(param)}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log(response.statusText);
        }
      })
      .then((responseJson) => {
        const { address_component } = responseJson.result;
        this.setState({
          address_component
        })
        //console.log(address_component);
        if (address_component) {
          this.weatherFecth(address_component);
        }
      });
  }
  weatherFecth = (location, type) => {
    this.setState({
      address_component: location
    });
    let url, info;
    if (type === 'tourist') {
      url = this.weatherTouristApi;
      info = 'forecast_1h|forecast_24h|tips|observe|rise';
    } else if (type === "external") {
      url = this.weatherExternalApi;
      info = 'forecast_24h|tips|observe|rise';
    } else {
      url = this.weatherCommonApi;
      info = 'forecast_1h|forecast_24h|index|alarm|limit|tips|air|observe|rise';
    }
    const param = {
      source: this.state.source,
      weather_type: info,
      ...location,
    }
    fetch(url + `?${queryString.stringify(param)}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .then((responseJson) => {
        this.reBuildForecast(responseJson.data);
      })
  }
  reBuildForecast = (data) => {
    let { forecast_24h, forecast_1h } = data;
    let forecast_arr24 = [];
    let forecast_arr1 = []
    for (let i in forecast_24h) {
      forecast_arr24.push(forecast_24h[i]);
    }
    for (let i in forecast_1h) {
      forecast_arr1.push(forecast_1h[i]);
    }
    data.forecast_24h = forecast_arr24;
    data.forecast_1h = forecast_arr1;
    this.setState({
      weatherData: data
    }, () => {
      this.renderSky();
    })
  }
  getCurrentLocation = () => {
    this.onCloseSearchPanel();
    this.geolocation();
  }
  openCityView = (event) => {
    this.setState({
      searchPanel: true
    });
  }
  onCloseSearchPanel = () => {
    this.setState({
      searchPanel: false
    })
  }
  render() {
    const height = window.innerHeight;
    const { address_component, searchPanel, day, scale } = this.state;
    styles.layer = {
      ...styles.layer,
    }
    return (
      <View className='index'>

        <View style={{ paddingTop: 40, position: 'absolute', zIndex: 199, alignItems: 'center', width: '100%' }}>
          <View onClick={this.openCityView}  >
            <Text style={{ ...styles.lightColor, ...styles.font20 }}>
              <Location style={styles.iconStyle} fill='white' />
              {address_component && this.showAddress()}
            </Text>
          </View>
          {this.showBreifObserve()}
        </View>
        <View style={{ ...styles.section1, height: '100%' }} >
          <View style={styles.layer}>
            <Image style={{ ...styles.layerImage, height: day.layer3.height / scale }} src={day.layer3.uri}></Image>
          </View>
          <View style={styles.layer}>
            <Image style={{ ...styles.layerImage, height: day.layer2.height / scale }} src={day.layer2.uri}></Image>
          </View>
          <View style={styles.layer}>
            <Image style={{ ...styles.layerImage, height: day.layer1.height / scale }} src={day.layer1.uri}></Image>
          </View>
        </View>
        {/* <Text>Hello world!</Text> */}
        <ScrollView
          style={{
            zIndex: 99,
            position: 'relative',
          }}
          scrollWithAnimation={true}
          scrollY={true}
        >
          <View>
            <View style={{ height: height / 4, }}></View>
            <View style={{ ...styles.section2, }}>
              {this.createListItem()}
            </View>
          </View>
          <View style={styles.section3}>
            {this.showMoreObserve()}
          </View>
        </ScrollView>
      </View>
    )
  }
  renderSky = () => {
    let isDay = true;
    const { weatherData } = this.state;
    let d = weatherData ? skyCode[weatherData.observe.weather_code] : "C2";
    weatherData.air && weatherData.air.aqi > 200 && "C7" !== d && (d = "C6");
    if (weatherData.rise) {
      const { rise } = weatherData;
      if (!rise[0]) {
        this.setState({
          day: skyLine.day[d]
        })
        return;
      }
      const { sunrise, sunset } = rise[0];
      const { update_time } = weatherData.observe;
      const now = moment();
      const update = moment(update_time, 'YYYYMMDDHHmmss');
      isDay = update.isSame(sunrise.time, "day") && now.isAfter(moment(sunrise, 'HH:mm'), 'minute') && now.isBefore(moment(sunset, 'HH:mm'), 'minute');
    }
    if (isDay) {
      this.setState({
        day: skyLine.day[d]
      })
    } else {
      this.setState({
        day: skyLine.night['C9']
      })
    }
  }
  fadeInCity = () => {
    return (
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          zIndex: 999
        }}
      >
        <CitySwtich
          setOuterState={this.setOuterState}
          onCloseSearchPanel={this.onCloseSearchPanel}
          getCurrentLocation={this.getCurrentLocation}
          weatherFecth={this.weatherFecth}
        />
      </View>
    );
  }
  setOuterState = (data) => {
    this.setState(
      data
    );
  }
  createListItem = () => {
    const { weatherData } = this.state;
    if (!weatherData || !weatherData.forecast_24h) {
      return false;
    } else {
      let { forecast_24h } = weatherData;
      forecast_24h = forecast_24h.slice(1, forecast_24h.length);
      forecast_24h = forecast_24h.map((item, index) => {
        return {
          ...item,
          key: index.toString()
        }
      });
      return (
        <View>
          <Swiper>
            {
              forecast_24h && forecast_24h.map((item) => {
                return (
                  <SwiperItem>
                    {this.getToday24Info}
                  </SwiperItem>
                );
              })
            }
          </Swiper>
        </View>
      );

    }

  }
  /**
   * 重写list头部样式
   */
  overrideRenderItem = ({ item }) => {
    return (
      <View style={{ paddingTop: 10, paddingBottom: 10 }}>
        {this.getTodayDegree(item)}
      </View>);

  }
  // section1 start 
  /**
   * 顶部信息
   */
  showBreifObserve = () => {
    const { weatherData, point } = this.state;
    if (!weatherData || !weatherData.observe) {
      return false;
    } else {
      const { observe, tips } = weatherData;

      return (
        <View style={{
          alignItems: "center",
          position: 'relative',
          zIndex: 99,
        }}>
          <Text style={{ fontSize: 50, ...styles.lightColor, paddingTop: 10 }}>{observe.degree}°</Text>
          <Text style={{ fontSize: 22, ...styles.lightColor, padding: 5 }}>{observe.weather_short}</Text>
          <View style={{ position: 'relative' }}>
            {this.humidityAnimate(observe)}
            {/* <Text style={{ ...styles.windHumidity }}>{windCode[observe.wind_direction]} {observe.wind_power}级</Text> */}
          </View>
          <Text style={{ ...styles.lightColor, ...styles.degreeNumberStyle, padding: 5 }}>{tips.observe[0]}</Text>
        </View>
      );
    }
  }
  humidityAnimate = (observe) => {
    return (
      <View>
        <Text style={{ ...styles.windHumidity }}>湿度 {observe.humidity}%</Text>
      </View>
    );
  }
  //section1 end
  //section3 start
  showMoreObserve = () => {
    const { weatherData } = this.state;
    if (!weatherData || !weatherData.observe) {
      return false;
    } else {
      const { observe, air, rise } = weatherData;
      const updateTime = observe.update_time.substring(8, 10) + ':' + observe.update_time.substring(10);
      return (
        <View style={{ flex: 1 }}>
          <View style={{ ...styles.borderBottom, flex: 1 }}>
            <Text style={{ ...styles.observeInfo, padding: 10, paddingLeft: 20 }}>中央气象台 {updateTime}发布</Text>
          </View>
          {rise['0'] &&
            <View style={{ paddingLeft: 20, paddingRight: 20, flex: 1 }}>
              <View style={{ ...styles.borderBottom, ...styles.observeLine, flex: 1 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.observeTitle}>日出</Text>
                  <Text style={styles.observeInfo}>{rise['0'].sunrise}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.observeTitle}>日落</Text>
                  <Text style={styles.observeInfo}>{rise['0'].sunset}</Text>
                </View>
              </View>
            </View>
          }
          {air &&
            <View style={{ paddingLeft: 20, paddingRight: 20, flex: 1 }}>
              <View style={{ ...styles.borderBottom, ...styles.observeLine, flex: 1 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.observeTitle}>空气指数</Text>
                  <Text style={styles.observeInfo}>{air.aqi}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.observeTitle}>空气质量</Text>
                  <Text style={styles.observeInfo}>{air.aqi_name}</Text>
                </View>
              </View>
            </View>
          }
          <View style={{ paddingLeft: 20, paddingRight: 20, flex: 1 }}>
            <View style={{ ...styles.borderBottom, ...styles.observeLine, flex: 1 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.observeTitle}>气压</Text>
                <Text style={styles.observeInfo}>{observe.pressure}百帕</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.observeTitle}>湿度</Text>
                <Text style={styles.observeInfo}>{observe.humidity}%</Text>
              </View>
            </View>
          </View>
          <View style={{ paddingLeft: 20, paddingRight: 20, flex: 1 }}>
            <View style={{ ...styles.observeLine, flex: 1 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.observeTitle}>降水量</Text>
                <Text style={styles.observeInfo}>{Math.round(observe.precipitation * 100)}%</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.observeTitle}>风速</Text>
                <Text style={styles.observeInfo}>{windCode[observe.wind_direction]} {observe.wind_power}级</Text>
              </View>
            </View>
          </View>
        </View >
      );
    }
  }

  //section2 start
  /**
   * 今日天气
   */
  getTodayDegree = (item) => {
    const { weatherData } = this.state;
    if (!weatherData || !weatherData.forecast_24h) {
      return false;
    } else {
      let { forecast_24h, forecast_1h } = weatherData;
      let today = forecast_24h[1];
      return (
        <View style={{ ...styles.todayTop, paddingLeft: 20, paddingRight: 10 }} >
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', }}>
            <Text style={styles.degreeNumberStyle}>{this.getDay(Date.now())} </Text>
            <Text style={styles.weekNumberStyle - 4}> 今天</Text>
          </View>
          {forecast_1h.length === 0 &&
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
              <WeatherComponent weatherCode={item.day_weather_code}></WeatherComponent>
              <WeatherComponent weatherCode={item.night_weather_code}></WeatherComponent>
            </View>
          }
          {forecast_1h.length !== 0 &&
            <View style={{ flex: 1 }}></View>
          }
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={styles.degreeNumberStyle}>{today.max_degree} </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.minDegreeStyle}> {today.min_degree}</Text>
            </View>
          </View>
        </View>
      );
    }
  }
  /**
   * 显示此刻到未来24小时天气
   */
  getToday24Info = ({ section }) => {
    if (!section.title) {
      return;
    }
    const { weatherData } = this.state;
    if (!weatherData || !weatherData.forecast_1h) {
      return false;
    } else {
      let { forecast_1h } = weatherData;
      forecast_1h = forecast_1h.map((item, index) => {
        return {
          ...item,
          key: index.toString()
        }
      })
      forecast_1h = forecast_1h.slice(0, 24);
      return (
        <View>
          {forecast_1h.length > 0 &&
            <View>
              <View style={{ borderBottomColor: '#cccccc', borderBottomWidth: 1 }}></View>
              <View style={{ ...styles.today24hours, backgroundColor: 'white' }}>
                <Swiper>
                  {
                    forecast_1h && forecast_1h.map((item) => {
                      const hour = item.update_time.substring(8, 10);
                      const min = item.update_time.substring(10, 12);
                      return (
                        <SwiperItem>
                          <View style={{ alignItems: 'center', padding: 15, justifyContent: "space-around" }}>
                            <Text style={styles.degreeNumberStyle}>{hour}:{min}</Text>
                            <WeatherComponent weatherCode={item.weather_code}></WeatherComponent>
                            <Text style={styles.degreeNumberStyle}>{item.degree}°</Text>
                          </View>
                        </SwiperItem>
                      );
                    })
                  }

                </Swiper>
              </View>
              <View style={{ borderBottomColor: '#cccccc', borderBottomWidth: 1 }}></View>
            </View>
          }
        </View>
      );
    }
  }
  onToggle = (e) => {
    console.log(e);
  }
  /**
   * 未来一周天气（不包含今日）
   */
  weekInfo = ({ item }) => {
    return (
      <View style={{ flexDirection: 'row', padding: 10, paddingLeft: 20, justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.degreeNumberStyle}>{this.getDay(item.time)}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
          <WeatherComponent weatherCode={item.day_weather_code}></WeatherComponent>
          <WeatherComponent weatherCode={item.night_weather_code}></WeatherComponent>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={styles.degreeNumberStyle}>{item.max_degree}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.minDegreeStyle}>{item.min_degree}</Text>
          </View>
        </View>
      </View>
    );
  }

  /**
   * 地址处理
   */
  showAddress = () => {
    const { address_component } = this.state;
    let address_array = [];

    if (address_component.nation) {
      address_array.push(address_component.nation);
    }
    if (address_component.country) {
      address_array.push(address_component.country);
    }
    if (address_component.province) {
      address_array.push(address_component.province);
    }
    if (address_component.city) {
      address_array.push(address_component.city);
    }
    if (address_component.county) {
      address_array.push(address_component.county);
    }
    if (address_component.district) {
      address_array.push(address_component.district);
    }
    if (address_component.tourist) {
      address_array.push(address_component.tourist);
    }
    if (address_array.length === 2) {
      if (address_array[0] === address_array[1]) {
        return address_array.slice(-1).join(' ');
      } else {
        return address_array.join(' ');
      }
    } else {
      return address_array.slice(-2).join(' ');
    }
  }
  /**
   * 显示工作日
   */
  getDay = (time) => {
    const day = new Date(time).getDay();
    switch (day) {
      case 1:
        return '星期一';
      case 2:
        return '星期二';
      case 3:
        return '星期三';
      case 4:
        return '星期四';
      case 5:
        return '星期五';
      case 6:
        return '星期六';
      case 0:
        return '星期日';
      default:
        return '坏天气'
    }

  }
}
