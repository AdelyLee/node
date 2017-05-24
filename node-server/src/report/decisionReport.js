/**
 * Created by lyc on 17-5-18.
 */
var url = require('./common.js');
var request = require('request');
var querystring = require('querystring')
var deasync = require('deasync');

const actions = {
    getArticleTypeChart: function () {
        var renderData = {}, isReturn = false;
        var param = {
            mustWord: '事故@安全生产',
            s_date: '2017-01',
            e_date: '2017-02'
        };

        var urlPath = url.webserviceUrl + '/es/findByMustShouldDateInType.json?' + querystring.stringify(param);
        request({
            url: urlPath,
            method: "get",
            json: true,
            headers: {
                "content-type": "application/json",
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('http request return!');
                isReturn = true;

                // 拼装 chart option
                var seriesData = [];
                for (var item of body) {
                    var node = {};
                    node.name = utils.resetArticleTypeName(item.key);
                    node.value = item.value;
                    seriesData.push(node);
                }

                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {},
                    series: [
                        {
                            name: '媒体类型',
                            type: 'pie',
                            radius: ['40%', '55%'],
                            label: {
                                normal: {
                                    show: true,
                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            data: seriesData
                        }
                    ]
                };

                renderData = option;
            }
        });

        while (!isReturn) {
            deasync.runLoopOnce();
        }

        return renderData;
    },

    getAccidentAreaChart: function () {
        var renderData = {}, isReturn = false;
        var param = {
            "date": {
                "startDate": "2017-01",
                "endDate": "2017-02"
            },
            "page": {
                "limit": 6,
                "orders": [
                    {
                        "direction": "DESC",
                        "orderBy": "count"
                    }
                ]
            },
            "types": [
                "province"
            ]
        };

        var urlPath = url.webserviceUrl + '/accident/aggByTypes';
        request({
            url: urlPath,
            method: "post",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: param
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('http request return!');
                isReturn = true;

                // 拼装 chart option
                var seriesData = [];
                var yAxisData = [];
                body = body.sort(function (a, b) {
                    return a.count - b.count;
                });
                for (var item of body) {
                    seriesData.push(item.count);
                    yAxisData.push(item.id);
                }
                var option = {
                    legend: {},
                    yAxis: {
                        data: yAxisData,
                        axisLabel: {
                            textStyle: {
                                fontWeight: 700,
                                fontSize: 20
                            }
                        }
                    },
                    xAxis: {
                        axisLabel: {
                            textStyle: {
                                fontWeight: 700,
                                fontSize: 20
                            }
                        }
                    },
                    series: [
                        {
                            name: '事故起数',
                            type: 'bar',
                            data: seriesData,
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        // build a color map as your need.
                                        var colorList = [
                                            '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                            '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                            '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                        ];
                                        return colorList[params.dataIndex % 15]
                                    }
                                }
                            }
                        }
                    ]
                };

                renderData = option;
            } else {
                console.log("get getAccidentAreaChart data error");
            }
        });

        while (!isReturn) {
            deasync.runLoopOnce();
        }

        return renderData;
    },

    //趋势图
    getArticleTrendChart: function () {
        var renderData = {}, isReturn = false;
        var param = {
            s_date: '2017-02',
            e_date: '2017-04',
            dateType: 'day'
        };

        var urlPath = url.webserviceUrl + '/es/filterAndGroupByTime.json?' + querystring.stringify(param);
        request({
            url: urlPath,
            method: "get",
            json: true,
            headers: {
                "content-type": "application/json",
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('http request return!');
                isReturn = true;
                var seriesData_a = [];
                var seriesData_b = [];
                var xAxisData = [];
                var heatMax_a = [], heatMax_b = [];
                for (var item of body) {
                    var node = {};
                    var nodes = {};
                    var month_name = item.key.substr(0, 7);
                    if (month_name == "2017-02") {
                        node.name = item.key.substr(8);
                        node.value = item.value;
                        heatMax_a = item.value;
                        seriesData_a.push(node);
                    } else if (month_name == "2017-03") {
                        xAxisData.push(item.key.substr(8));
                        nodes.name = item.key.substr(8);
                        nodes.value = item.value;
                        heatMax_b = item.value;
                        seriesData_b.push(nodes);
                    }
                }

                var option = {
                    legend: {
                        x: 'right',
                        y: 'middle',
                        orient: 'vertical',
                        data: ['2017年2月', '2017年3月']
                    },
                    grid: {
                        left: '4%',
                        right: '150px',
                        bottom: '3%',
                        containLabel: true
                    },
                    color: ['#e7ba09', '#30a8dd'],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: xAxisData,
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            interval: 0,
                            rotate: 35,
                            textStyle: {
                                fontWeight: 600,
                                fontSize: 14
                            }
                        }
                    },
                    series: [
                        {
                            name: '2017年2月',
                            type: 'line',
                            data: seriesData_a
                        },
                        {
                            name: '2017年3月',
                            type: 'line',
                            data: seriesData_b
                        }
                    ]
                };

                renderData = option;
            } else {
                console.log("get getArticleTrendChart data error");
            }
        });

        while (!isReturn) {
            deasync.runLoopOnce();
        }

        return renderData;
    },

    getArticleHotPointChart: function () {
        var renderData = {}, isReturn = false;
        var param = {
            groupName: 'title.raw',
            s_date: '2017-01',
            e_date: '2017-02'
        };

        var urlPath = url.webserviceUrl + '/es/filterAndGroupBy.json?' + querystring.stringify(param);
        request({
            url: urlPath,
            method: "get",
            json: true,
            headers: {
                "content-type": "application/json",
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('http request return!');
                isReturn = true;

                var new_data = [];
                if (body.length > 6) {
                    new_data = body.slice(0, 6);
                } else {
                    new_data = body;
                }
                // 拼装 chart option
                var seriesData = [];
                var yAxisData = [];
                // data = data.sort(function (a, b) {
                //     return a.value -b.value;
                // });
                for (var item of new_data) {
                    seriesData.push(item.value);
                    yAxisData.push(item.key);
                }
                var option = {
                    legend: {},
                    yAxis: {
                        type: 'category',
                        data: yAxisData,
                        axisLabel: {
                            textStyle: {
                                fontWeight: 700,
                                fontSize: 20
                            }
                        }
                    },
                    grid: {
                        left: '10',
                        right: '10',
                        bottom: '10',
                        top: '10',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        axisLabel: {
                            textStyle: {
                                fontWeight: 700,
                                fontSize: 20
                            }
                        }
                    },
                    series: [
                        {
                            name: '舆论热点',
                            type: 'bar',
                            data: seriesData,
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        // build a color map as your need.
                                        var colorList = [
                                            '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                            '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                            '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                        ];
                                        return colorList[params.dataIndex % 15]
                                    }
                                }
                            }
                        }
                    ]
                };

                renderData = option;
            } else {
                console.log("get getArticleHotPointChart data error");
            }
        });

        while (!isReturn) {
            deasync.runLoopOnce();
        }

        return renderData;
    },

    //新闻情感类型
    getNewsEmotionPieChart: function () {
        var renderData = {}, isReturn = false;
        var param = {
            groupName: 'nlp.sentiment.label',
        };

        var urlPath = url.webserviceUrl + '/news/filterAndGroupBy.json?' + querystring.stringify(param);
        request({
            url: urlPath,
            method: "get",
            json: true,
            headers: {
                "content-type": "application/json",
            }
        }, function (error, response, data) {
            if (!error && response.statusCode == 200) {
                console.log('http request return!');
                isReturn = true;

                // 拼装 chart option
                var seriesData = [];
                var lengeds = [];
                var temps = ["正面", "负面", "中性"];
                for (var j = 0; j < temps.length; j++) {
                    var node = {value: 0};
                    for (var item of data) {
                        node.name = utils.resetEmotionTypeName(item.key);
                        if (node.name == temps[j]) {
                            node.value += item.value;
                        }
                    }
                    node.name = temps[j];
                    seriesData.push(node);
                    lengeds.push(node.name)
                }

                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'right',
                        data: lengeds
                    },
                    series: [
                        {
                            name: '情感类型',
                            type: 'pie',
                            radius: ['40%', '60%'],
                            label: {
                                normal: {
                                    show: false,
                                    // position: 'center',
                                    textStyle: {
                                        fontSize: 20
                                    }
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: seriesData
                        }
                    ]
                };

                renderData = option;
            } else {
                console.log("get getNewsEmotionPieChart data error");
            }
        });

        while (!isReturn) {
            deasync.runLoopOnce();
        }

        return renderData;
    },

    //主流媒体
    getMediaBarChart: function () {
        var renderData = {}, isReturn = false;
        var param = {
            groupName: 'source.raw',
            s_date: '2017-02',
            e_date: '2017-04',
        };

        var urlPath = url.webserviceUrl + '/news/filterAndGroupBy.json?' + querystring.stringify(param);
        request({
            url: urlPath,
            method: "get",
            json: true,
            headers: {
                "content-type": "application/json",
            }
        }, function (error, response, data) {
            if (!error && response.statusCode == 200) {
                console.log('http request return!');
                isReturn = true;

                var seriesData = [];
                var xAxisData = [];
                data = data.sort(function (a, b) {
                    return b.value - a.value;
                });
                for (var item of data) {
                    seriesData.push(item.value);
                    xAxisData.push(item.key);
                }
                var option = {
                    legend: {},
                    grid: {
                        bottom: 120
                    },
                    yAxis: {
                        axisLabel: {
                            textStyle: {
                                fontWeight: 700,
                                fontSize: 20
                            }
                        }

                    },
                    xAxis: {
                        data: xAxisData,
                        axisLabel: {
                            interval: 0,
                            rotate: 35,
                            textStyle: {
                                fontWeight: 700,
                                fontSize: 20
                            }
                        }
                    },
                    series: [
                        {
                            name: '媒体名称',
                            type: 'bar',
                            data: seriesData,
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        // build a color map as your need.
                                        var colorList = [
                                            '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                            '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                            '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                        ];
                                        return colorList[params.dataIndex % 15]
                                    }
                                }
                            }
                        }
                    ]
                };

                renderData = option;
            } else {
                console.log("get getMediaBarChart data error");
            }
        });

        while (!isReturn) {
            deasync.runLoopOnce();
        }

        return renderData;
    },

    getMonthAccidentChart: function () {
        var renderData = {}, isReturn = false;
        var param = {
            groupName: 'title.raw',
            s_date: '2017-01',
            e_date: '2017-02'
        };

        var urlPath = url.webserviceUrl + '/es/filterAndGroupBy.json?' + querystring.stringify(param);
        request({
            url: urlPath,
            method: "get",
            json: true,
            headers: {
                "content-type": "application/json",
            }
        }, function (error, response, data) {
            if (!error && response.statusCode == 200) {
                console.log('http request return!');
                isReturn = true;

                var new_data = [];
                if (data.length > 6) {
                    new_data = data.slice(0, 6);
                } else {
                    new_data = data;
                }
                // 拼装 chart option
                var seriesData = [];
                var yAxisData = [];
                // data = data.sort(function (a, b) {
                //     return a.value -b.value;
                // });
                for (var item of new_data) {
                    seriesData.push(item.value);
                    yAxisData.push(item.key);
                }
                var option = {
                    legend: {},
                    yAxis: {
                        type: 'category',
                        data: yAxisData,
                        axisLabel: {
                            textStyle: {
                                fontWeight: 700,
                                fontSize: 20
                            }
                        }
                    },
                    grid: {
                        left: '10',
                        right: '10',
                        bottom: '10',
                        top: '10',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        axisLabel: {
                            textStyle: {
                                fontWeight: 700,
                                fontSize: 20
                            }
                        }
                    },
                    series: [
                        {
                            name: '舆论热点',
                            type: 'bar',
                            data: seriesData,
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        // build a color map as your need.
                                        var colorList = [
                                            '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                            '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                            '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                        ];
                                        return colorList[params.dataIndex % 15]
                                    }
                                }
                            }
                        }
                    ]
                };

                renderData = option;
            } else {
                console.log("get getMonthAccidentChart data error");
            }
        });

        while (!isReturn) {
            deasync.runLoopOnce();
        }

        return renderData;
    },

    //事故类型饼图
    getAccidentTypeChart: function () {
        var renderData = {}, isReturn = false;
        var param = {
            "date": {
                "endDate": "2017-03",
                "startDate": "2017-02"
            },
            "page": {
                "limit": 10,
                "orders": [{
                    "direction": "DESC",
                    "orderBy": "count"
                }],
                "page": 1
            },
            "types": [
                "atype"
            ]
        };

        var urlPath = url.webserviceUrl + '/accident/aggByTypes';
        request({
            url: urlPath,
            method: "post",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: param
        }, function (error, response, data) {
            if (!error && response.statusCode == 200) {
                console.log('http request return!');
                isReturn = true;

                // 拼装 chart option
                var seriesData = [];
                for (var item of data) {
                    var node = {};
                    node.name = item.id;
                    node.value = item.count;
                    seriesData.push(node);
                }
                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {},
                    series: [
                        {
                            name: '事故类型',
                            type: 'pie',
                            radius: ['0%', '55%'],
                            // roseType : 'area',
                            label: {
                                normal: {
                                    show: true,
                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            data: seriesData,
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        // build a color map as your need.
                                        var colorList = [
                                            '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                            '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                            '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                        ];
                                        return colorList[params.dataIndex % 15]
                                    }
                                }
                            }
                        }
                    ]
                };

                renderData = option;
            } else {
                console.log("get getAccidentTypeChart data error");
            }
        });

        while (!isReturn) {
            deasync.runLoopOnce();
        }

        return renderData;
    },

    getAccidentMapChart: function () {
        var renderData = {}, isReturn = false;
        var param = {
            "date": {
                "endDate": "2017-03",
                "startDate": "2017-02"
            },
            "page": {
                "limit": 40,
                "orders": [{
                    "direction": "DESC",
                    "orderBy": "count"
                }],
                "page": 1
            },
            "types": [
                "province"
            ]
        };

        var urlPath = url.webserviceUrl + '/accident/aggByTypes';
        request({
            url: urlPath,
            method: "post",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: param
        }, function (error, response, data) {
            if (!error && response.statusCode == 200) {
                console.log('http request return!');
                isReturn = true;

                // 拼装 chart option
                var maxCount = 0;
                var seriesData = [];
                for (var item of data) {
                    var node = {};
                    node.name = item.id;
                    node.value = item.count;
                    seriesData.push(node);
                }
                seriesData.sort(function (a, b) {
                    return b.value - a.value
                });
                maxCount = seriesData[0].value == undefined ? 10 : seriesData[0].value;
                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c}"
                    },
                    visualMap: {
                        min: 0,
                        max: maxCount,
                        left: 'left',
                        top: 'bottom',
                        text: ['高', '低'],           // 文本，默认为数值文本
                        calculable: true
                    },
                    series: [
                        {
                            name: '事故起数',
                            type: 'map',
                            mapType: 'china',
                            label: {
                                normal: {
                                    show: true,
                                }
                            },
                            data: seriesData
                        }
                    ]
                };

                renderData = option;
            } else {
                console.log("get getAccidentMapChart data error");
            }
        });

        while (!isReturn) {
            deasync.runLoopOnce();
        }

        return renderData;

        return new Promise(function (resolve, reject) {
            $.ajax({
                url: common.url.mongodbUrl + '/accident/aggByTypes',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(param),
                type: 'post',
                success: function (data) {


                    resolve(option);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    },

    //相关评论
    getCommentPieChart: function () {
        var renderData = {}, isReturn = false;
        var param = {
            mustWord: '事故@安全生产',
            startDate: '2017-01',
            endDate: '2017-02'
        };

        var urlPath = url.webserviceUrl + '/es/findByMustShouldDateInType.json?' + querystring.stringify(param);
        request({
            url: urlPath,
            method: "get",
            json: true,
            headers: {
                "content-type": "application/json",
            }
        }, function (error, response, data) {
            if (!error && response.statusCode == 200) {
                console.log('http request return!');
                console.log('data', data);
                isReturn = true;

                // 拼装 chart option
                data = data.sort(function (a, b) {
                    return b.value - a.value;
                });
                var news = {}, weiBo = {}, pinglun = {}, tieba = {}, luntan = {}, total = 0, seriesData = [], lengeds = [];

                for (var item of data) {
                    seriesData.push(utils.resetArticleTypeName(item.key));
                }
                for (var j = 0; j < seriesData.length; j++) {
                    for (var item of data) {
                        var temp = utils.resetArticleTypeName(item.key);
                        if (seriesData[j] == temp) {
                            switch (temp) {
                                case "新闻":
                                    news.name = temp;
                                    news.value = parseInt(item.value);
                                    break;
                                case "微博":
                                    weiBo.name = temp;
                                    weiBo.value = parseInt(item.value);
                                    break;
                                case "论坛":
                                    luntan.name = temp;
                                    luntan.value = parseInt(item.value);
                                    break;
                                case "贴吧":
                                    tieba.name = temp;
                                    tieba.value = parseInt(item.value);
                                    break;
                                case "评论":
                                    pinglun.name = temp;
                                    pinglun.value = parseInt(item.value);
                                    break;

                            }
                            lengeds.push(temp)
                        }
                    }
                }

                var dataStyle = {
                    normal: {
                        label: {show: false},
                        labelLine: {show: false},
                        shadowBlur: 40,
                        shadowColor: 'rgba(40, 40, 40, 0.5)',
                    }
                };
                var placeHolderStyle = {
                    normal: {
                        color: 'rgba(0,0,0,0)',
                        label: {show: false},
                        labelLine: {show: false}
                    },
                    emphasis: {
                        color: 'rgba(0,0,0,0)'
                    }
                };
                var option = {
                    color: ['#85b6b2', '#6d4f8d', '#cd5e7e', '#e38980', '#f7db88'],
                    tooltip: {
                        show: true,
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    series: [
                        {
                            name: '新闻',
                            type: 'pie',
                            clockWise: false,
                            center: ['50%', '50%'],
                            radius: [160, 180],
                            itemStyle: dataStyle,
                            hoverAnimation: false,
                            data: [{
                                value: news.value
                            },
                                {
                                    value: utils.resetNumberType(news.value),
                                    name: 'invisible',
                                    itemStyle: placeHolderStyle
                                }
                            ]
                        },
                        {
                            name: '微博',
                            type: 'pie',
                            clockWise: false,
                            center: ['50%', '50%'],
                            radius: [180, 200],
                            itemStyle: dataStyle,
                            hoverAnimation: false,
                            data: [{
                                value: weiBo.value
                            },
                                {
                                    value: utils.resetNumberType(weiBo.value),
                                    name: 'invisible',
                                    itemStyle: placeHolderStyle
                                }

                            ]
                        },

                        {
                            name: '论坛',
                            type: 'pie',
                            clockWise: false,
                            hoverAnimation: false,
                            center: ['50%', '50%'],
                            radius: [100, 120],
                            itemStyle: dataStyle,
                            data: [
                                {
                                    value: luntan.value
                                },
                                {
                                    value: utils.resetNumberType(luntan.value),
                                    name: 'invisible',
                                    itemStyle: placeHolderStyle
                                }
                            ]
                        },
                        {
                            name: '评论',
                            type: 'pie',
                            clockWise: false,
                            center: ['50%', '50%'],
                            hoverAnimation: false,
                            radius: [140, 160],
                            itemStyle: dataStyle,
                            data: [
                                {
                                    value: pinglun.value
                                },
                                {
                                    value: utils.resetNumberType(pinglun.value),
                                    name: 'invisible',
                                    itemStyle: placeHolderStyle
                                }
                            ]
                        },
                        {
                            name: '贴吧',
                            type: 'pie',
                            clockWise: false,
                            center: ['50%', '50%'],
                            hoverAnimation: false,
                            radius: [120, 140],
                            itemStyle: dataStyle,
                            data: [
                                {
                                    value: tieba.value
                                },
                                {
                                    value: utils.resetNumberType(tieba.value),
                                    name: 'invisible',
                                    itemStyle: placeHolderStyle
                                }
                            ]
                        }
                    ]
                };

                renderData = option;
            } else {
                console.log("get getMonthAccidentChart data error");
            }
        });

        while (!isReturn) {
            deasync.runLoopOnce();
        }

        return renderData;
    },

};

const utils = {
    resetArticleTypeName: function (source) {
        var target = '';
        switch (source) {
            case 'news':
                target = '新闻';
                break;
            case 'weibo':
                target = '微博';
                break;
            case 'bbs':
                target = '论坛';
                break;
            case 'bar':
                target = '贴吧';
                break;
            case 'comment':
                target = '评论';
                break;
        }

        return target;
    },

    resetEmotionTypeName: function (source) {
        var type = '';
        switch (source) {
            case 'pos':
                type = '正面';
                break;
            case 'POS':
                type = '正面';
                break;
            case 'neg':
                type = '负面';
                break;
            case 'NEG':
                type = '负面';
                break;
            case 'neu':
                type = '中性';
                break;
            case 'NEU':
                type = '中性';
                break;
        }

        return type;
    },

    resetNumberType: function (num) {
        var numbers = 0;
        var l = num.toString().length;
        console.log(l);
        if (l == 3) {
            numbers = num / 2 - 100;
        } else if (l == 4) {
            numbers = num / 2 - 1000;
        } else if (l >= 5) {
            numbers = num / 2 - 10000;
        } else {
            numbers = num
        }
        return numbers
    }
};

module.exports = actions;
