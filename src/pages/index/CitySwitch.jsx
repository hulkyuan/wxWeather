import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Swiper } from '@tarojs/components'
import queryString from 'query-string'
//import AsyncStorage from '@react-native-community/async-storage';
import NavigateIcon from './assets/images/svg/ios-navigate.svg'
const SwiperItem = Swiper.SwiperItem;
const styles = {
    iconStyle: {
        width: 20,
        height: 20
    },
    searchPanel: {
        width: '100%', height: '100%', backgroundColor: 'white', position: 'absolute', top: 0, left: 0, zIndex: 999,
    },
    searchBar: {
        paddingLeft: 20, flexDirection: 'row', alignItems: 'center', height: 60, paddingTop: 10
    },
    searchInputContainer: {
        flex: 4
    },
    searchInput: {
        borderWidth: 1, borderColor: '#cccccc', fontSize: 20, padding: 10, borderRadius: 10,
    },
    searchCloseBtn: {
        flex: 1
    },
    searchList: {
        flex: 1, paddingLeft: 30, paddingTop: 15
    },
    searchItem: {
        fontSize: 20, paddingBottom: 15
    },
    historyItem: {
        padding: 10, paddingLeft: 20, paddingRight: 20, backgroundColor: '#f2f2f2', margin: 5, marginLeft: 0, borderRadius: 20
    }
};

export default class CitySwitch extends Component {
    queryTimeout = 0;
    /**
         * 查询城市source=xw&city=??
         */
    matchApi = 'https://wis.qq.com/city/matching';
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            list: this.props.list || [],
            heartBeat: 500,
            source: 'xw',
            result: '',
            history: []
        }
    }
    //关闭页面动画
    componentWillUnmount() {
        clearTimeout(this.queryTimeout);
    }
    componentDidMount() {
        //this.getHistory();
    }
    // getHistory = async () => {
    //     try {
    //         const value = await AsyncStorage.getItem('history');
    //         let setData = [];
    //         if (value !== null) {
    //             setData = JSON.parse(value);
    //         }
    //         this.setState({
    //             history: setData
    //         })
    //         return setData;
    //     } catch (error) {
    //         //console.log(error);
    //     }
    // }
    // storeData = async (item) => {
    //     let historyList = await this.getHistory();
    //     const store = { name: item.name, type: item.type };
    //     historyList.unshift(store);
    //     historyList = historyList.map((element, index) => {
    //         return {
    //             ...element,
    //             key: index
    //         }
    //     });
    //     const unique = historyList
    //         .sort((a, b) => a.name > b.name)
    //         .reduce((init, current) => {
    //             if (init.length === 0 || init[init.length - 1].name !== current.name) {
    //                 init.push(current);
    //             }
    //             return init;
    //         }, [])
    //         .slice(0, 3)
    //         .sort((a, b) => a.key < b.key);
    //     try {
    //         await AsyncStorage.setItem('history', JSON.stringify(unique));
    //         return true;
    //     } catch (error) {
    //         //console.log(error);
    //     }
    // }

    render() {
        let { searchText, list, result, loading, history } = this.state;
        history = history.map((item, index) => {
            return {
                ...item,
                key: index
            }
        })
        return (
            <View style={{ flex: 1 }}>
                <View style={{ alignItems: 'center', paddingTop: 10 }}>
                    <Text style={{ fontSize: 16 }}>输入城市,旅游景点名或海外城市</Text>
                </View>
                <View style={styles.searchBar}>
                    <View style={styles.searchInputContainer}>
                        <Input
                            placeholder="搜索地区"
                            onInput={this.onChangeText}
                            style={styles.searchInput}
                            value={searchText}
                            autoFocus={true}
                            clearButtonMode="always"
                        />
                    </View>
                    <View style={styles.searchCloseBtn}>
                        <Button onClick={this.props.onCloseSearchPanel} title="取消" />
                    </View>
                </View>
                <View style={{ padding: 5, paddingLeft: 20 }}>
                    <View onClick={this.props.getCurrentLocation}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <NavigateIcon style={{ ...styles.iconStyle, paddingRight: 10 }} fill="lightblue" />
                            <Text>获取当前位置</Text>
                        </View>
                    </View>
                </View>
                <View style={{ borderBottomColor: 'white', paddingBottom: 1, borderBottomWidth: 1, shadowOpacity: 1, shadowColor: '#cccccc', shadowRadius: 1, shadowOffset: { height: 1 } }}></View>

                <View style={{ ...styles.searchList }}>
                    {
                        history.length > 0 &&
                        <View >
                            <Text>历史记录</Text>
                            {this.createHistoryItem(history)}
                        </View>
                    }
                    {loading &&
                        <View >
                            {/* <ActivityIndicator size="small" color="lightblue" /> */}
                            <Text>加载中...</Text>
                        </View>
                    }
                    {result !== '' &&
                        <Text>{result}</Text>
                    }
                    {result === '' &&
                        <Swiper>
                            {
                                list && list.map((item) => {
                                    return () => { return this.createSearchItem(item) };
                                })
                            }
                        </Swiper>
                    }
                </View>
            </View>

        );
    }
    createSearchItem = ({ item }) => {
        return (
            <SwiperItem>
                <View >
                    <View onClick={() => { this.onChooseCity(item); }}>
                        <Text style={styles.searchItem}>{item.name}</Text>
                    </View>
                </View>
            </SwiperItem>
        );
    }
    createHistoryItem = (history) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                {history.map((item, index) => {
                    const splitArray = item.name.split(',');
                    const cityName = splitArray[splitArray.length - 1].trim();
                    return (
                        <View key={index} onClick={() => { this.onChooseCity(item); }}>
                            <View style={{ ...styles.historyItem }}>
                                <Text >{cityName}</Text>
                            </View>
                        </View>
                    );
                })}

            </View>
        );
    }
    onChooseCity = async (item) => {
        let data;
        if (item.type === 'tourist') {
            data = {
                tourist: item.name
            };
        } else if (item.type === 'external') {
            data = {
                country: item.name.split(',')[0] && item.name.split(',')[0].trim(),
                city: item.name.split(',')[1] && item.name.split(',')[1].trim(),
            }
        } else {
            data = {
                province: item.name.split(',')[0] && item.name.split(',')[0].trim(),
                city: item.name.split(',')[1] && item.name.split(',')[1].trim(),
                county: item.name.split(',')[2] && item.name.split(',')[2].trim()
            }
        }
        //const res = await this.storeData(item);
        //if (res) {
        this.props.onCloseSearchPanel();
        this.props.weatherFecth(data, item.type);
        //}
    }

    onChangeText = (text) => {
        clearTimeout(this.queryTimeout);
        this.setState({
            searchText: text
        }, () => {
            if (!text) {
                this.setState({
                    result: ''
                })
                return;
            }
            this.queryTimeout = setTimeout(this.fecthCity, this.state.heartBeat);
        });

    }
    setOuterState = (data) => {
        this.props.setOuterState(data);
    }
    /**
 * 切换城市请求
 */
    fecthCity = () => {
        const { searchText } = this.state;
        const param = {
            source: this.state.source,
            city: searchText
        }
        this.setState({
            loading: true
        });
        fetch(this.matchApi + `?${queryString.stringify(param)}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    Alert.alert(response.statusText);
                }
            })
            .then((responseJson) => {
                if (responseJson.data) {
                    const { data } = responseJson;
                    let list = [];
                    for (let prop in data) {
                        if (data[prop] instanceof Object) {
                            for (let i in data[prop]) {
                                const item = { key: i, name: data[prop][i], type: prop }
                                list.push(item);
                            }
                        }
                    }
                    this.setState({
                        list,
                        result: list.length === 0 ? '未找到结果' : '',
                        loading: false
                    });
                }
            })
    }

}