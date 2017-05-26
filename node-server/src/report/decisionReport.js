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
                var total = 0;
                var seriesData = [];
                for (var item of body) {
                    if (item.key != 'article') {
                        var node = {};
                        node.name = utils.resetArticleTypeName(item.key);
                        node.value = item.value;
                        seriesData.push(node);
                    } else {
                        total = item.value;
                    }
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

                // make ArticleTypeChart description
                var itemsStr = "";
                seriesData.forEach(function (item, i) {
                    if (i < 3) {
                        itemsStr += "<span class='describe-redText'>" + item.name + item.value + "(" + (item.value * 100 / total).toFixed(2) + "%)</span>、";
                    }
                });
                itemsStr = itemsStr.substring(0, itemsStr.length - 1) + "。";
                var description = "<div class='describe-text'>根据互联网抓取的数据，对数据载体进行分析，共抓取数据<span class='describe-redText'>" + total + "</span>条，其中排名前三的为" + itemsStr + "</div>";

                renderData.option = JSON.stringify(option);
                renderData.description = description;
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
        }, function (error, response, data) {
            if (!error && response.statusCode == 200) {
                console.log('http request return!');
                isReturn = true;

                // 拼装 chart option
                var total = 0, seriesData = [], yAxisData = [];
                data = data.sort(function (a, b) {
                    return b.count - a.count;
                });
                data.forEach(function (item, i) {
                    total += item.count;
                    if (i < 6) {
                        seriesData.push(item.count);
                        yAxisData.push(item.id);
                    }
                });
                // 实现数据反转
                seriesData.reverse();
                yAxisData.reverse();

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

                // make ArticleTypeChart description
                var itemsStr = "";
                data.forEach(function (item, i) {
                    if (i < 6) {
                        itemsStr += "<span class='describe-redText'>" + item.id + item.count + "(" + (item.count * 100 / total).toFixed(2) + "%)</span>、";
                    }
                });
                itemsStr = itemsStr.substring(0, itemsStr.length - 1) + "。";

                var description = "<div class='describe-text'>根据互联网抓取的数据，对本月事故情况进行分析，共发生事故<span class='describe-redText'>" + total + "</span>起，其中发生较多的省份为" + itemsStr + "</div>";
                renderData.option = JSON.stringify(option);
                renderData.description = description;

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
        }, function (error, response, data) {
            if (!error && response.statusCode == 200) {
                console.log('http request return!');
                isReturn = true;

                var total_a = 0, total_b = 0, seriesData_a = [], seriesData_b = [], xAxisData = [], xAxisData_a = [], xAxisData_b = [], indexOfMax_a = {}, indexOfMin_a = {}, indexOfMax_b = {}, indexOfMin_b = {}, legendData = [];
                var s_dateArray = param.s_date.split("-");
                var e_dateArray = param.e_date.split("-");
                var e_date = "";
                if (parseInt(e_dateArray[1]) < 11) {
                    e_date = e_dateArray[0] + "-0" + (parseInt(e_dateArray[1]) - 1);
                } else {
                    e_date = e_dateArray[0] + "-" + (parseInt(e_dateArray[1]) - 1);
                }
                var startDate = s_dateArray[0] + "年" + s_dateArray[1] + "月";
                var endDate = e_dateArray[0] + "年" + parseInt(e_dateArray[1] - 1) + "月";
                legendData.push(startDate);
                legendData.push(endDate);

                for (var item of data) {
                    var month_name = item.key.substr(0, 7);
                    if (month_name == param.s_date) {
                        xAxisData_a.push(item.key.substr(8));
                        seriesData_a.push(item.value);
                    } else if (month_name == e_date) {
                        xAxisData_b.push(item.key.substr(8));
                        seriesData_b.push(item.value);
                    }
                }
                // 以天数长的月份作为横轴坐标
                if (xAxisData_a.length > xAxisData_b.length) {
                    xAxisData = xAxisData_a;
                } else {
                    xAxisData = xAxisData_b;
                }
                // 获取数据的最高点和最地点
                indexOfMax_a = seriesData_a.indexOf(Math.max.apply(Math, seriesData_a));
                indexOfMin_a = seriesData_a.indexOf(Math.min.apply(Math, seriesData_a));

                indexOfMax_b = seriesData_b.indexOf(Math.max.apply(Math, seriesData_b));
                indexOfMin_b = seriesData_b.indexOf(Math.min.apply(Math, seriesData_b));
                // 获取所有数据总数
                seriesData_a.forEach(function (value) {
                    total_a += value;
                });
                seriesData_b.forEach(function (value) {
                    total_b += value;
                });

                var option = {
                    legend: {
                        x: 'right',
                        y: 'middle',
                        orient: 'vertical',
                        data: legendData
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
                        axisLabel: {
                            textStyle: {
                                fontWeight: 700,
                                fontSize: 16
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            interval: 0,
                            textStyle: {
                                fontWeight: 600,
                                fontSize: 18
                            }
                        }
                    },
                    series: [
                        {
                            name: startDate,
                            type: 'line',
                            data: seriesData_a
                        },
                        {
                            name: endDate,
                            type: 'line',
                            data: seriesData_b
                        }
                    ]
                };

                // make ArticleTypeChart description
                var description = '<div class="describe-text">根据最新舆情分析, ' + parseInt(e_dateArray[1] - 1)
                    + '月份中，共抓取互联网数据<span class="describe-redText">' + total_b
                    + '</span>条，其中<span class="describe-redText">' + parseInt(indexOfMax_b + 1)
                    + '</span>日热度最高，共有数据<span class="describe-redText">' + seriesData_b[indexOfMax_b] + '</span>条。'
                    + '<span class="describe-redText">' + parseInt(indexOfMin_b + 1)
                    + '</span>日最低，共有数据<span class="describe-redText">' + seriesData_b[indexOfMin_b] + '</span>条。'
                    + '环比<span class="describe-redText">' + parseInt(s_dateArray[1]) + '</span>月份，共抓取互联网数据'
                    + '<span class="describe-redText">' + total_a + '</span>条，其中<span class="describe-redText">' + parseInt(indexOfMax_a + 1)
                    + '</span>日热度最高，共有数据<span class="describe-redText">' + seriesData_a[indexOfMax_a] + '</span>条。'
                    + '<span class="describe-redText">' + parseInt(indexOfMin_a + 1)
                    + '</span>日最低，共有数据<span class="describe-redText">' + seriesData_a[indexOfMin_a] + '</span>条。</div>';

                renderData.option = JSON.stringify(option);
                renderData.description = description;
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
        }, function (error, response, data) {
            if (!error && response.statusCode == 200) {
                console.log('http request return!');
                isReturn = true;

                // 拼装 chart option
                if (data.length > 6) {
                    data = data.slice(0, 6);
                }
                data = data.sort(function (a, b) {
                    return a.value - b.value;
                });

                var seriesData = [];
                var yAxisData = [];
                for (var item of data) {
                    seriesData.push(item.value);
                    if (item.key.length > 18) {
                        item.key = item.key.substring(0, 18) + '...';
                    }
                    yAxisData.push(item.key);
                }
                var option = {
                    yAxis: {
                        type: 'category',
                        data: yAxisData,
                        axisLabel: {
                            textStyle: {
                                fontWeight: 700,
                                fontSize: 18
                            }
                        }
                    },
                    grid: {
                        left: '10',
                        right: '30',
                        bottom: '10',
                        top: '10',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        axisLabel: {
                            textStyle: {
                                fontWeight: 700,
                                fontSize: 18
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

                // make description
                var dataMonth = parseInt(param.s_date.split("-")[1]);
                var itemStr = "";
                data = data.reverse();
                data.forEach(function (item, i) {
                    if (i < 3) {
                        itemStr += '<span class="describe-redText">“' + item.key + '” (' + item.value + ')</span>、';
                    }
                });
                itemStr = itemStr.substring(0, itemStr.length - 1);
                var description = '<div class="describe-text">' + dataMonth + '月份媒体报道情况，从其具体内容方面也可以发现，主要话题集中在'
                    + itemStr + '等几个方面。</div>';
                renderData.option = JSON.stringify(option);
                renderData.description = description;
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
                var seriesData = [], legendData = [];
                for (var item of data) {
                    var node = {};
                    node.name = utils.resetEmotionTypeName(item.key);
                    node.value = item.value;
                    seriesData.push(node);
                    legendData.push(node.name)
                }

                var option = {
                    title: {
                        text: '情感分析',
                        left: 'center',
                        top: '55%',
                        textStyle: {
                            fontSize: 20,
                            fontWeight: 600
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        x: 'right',
                        textStyle: {
                            fontSize: 15,
                            fontWeight: 500
                        },
                        data: legendData
                    },
                    series: [
                        {
                            name: '情感类型',
                            type: 'pie',
                            radius: ['40%', '60%'],
                            label: {
                                normal: {
                                    show: false,
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

                var total = 0;
                for (var item of seriesData) {
                    total += item.value;
                }

                var description = "<div class='describe-text'>根据互联网抓取的数据，对数据情感进行分析，<span class='describe-redText'>" + seriesData[0].name
                    + "</span>情感最多有<span class='describe-redText'>" + seriesData[0].value + "(" + (seriesData[0].value * 100 / total).toFixed(2) + "%)" + "</span>，"
                    + "<span class='describe-redText'>" + seriesData[1].name + seriesData[1].value + "(" + (seriesData[1].value * 100 / total).toFixed(2) + "%)" + "</span>，"
                    + "<span class='describe-redText'>" + seriesData[2].name + seriesData[2].value + "(" + (seriesData[2].value * 100 / total).toFixed(2) + "%)" + "</span>。</div>";
                renderData.option = JSON.stringify(option);
                renderData.description = description;
            } else {
                console.log("get getNewsEmotionPieChart data error");
            }
        });

        while (!isReturn) {
            deasync.runLoopOnce();
        }

        return renderData;
    },

    // TODO: 接口出错
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

                var description = "<div class='describe-text'>根据互联网抓取的数据，对数据载体进行分析，共抓取数据<span class='describe-redText'></span></div>";
                renderData.option = JSON.stringify(option);
                renderData.description = description;
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

                // 拼装 chart option
                if (data.length > 6) {
                    data = data.slice(0, 6);
                }
                data = data.sort(function (a, b) {
                    return a.value - b.value;
                });

                var seriesData = [];
                var yAxisData = [];
                for (var item of data) {
                    seriesData.push(item.value);
                    if (item.key.length > 18) {
                        item.key = item.key.substring(0, 18) + '...';
                    }
                    yAxisData.push(item.key);
                }
                var option = {
                    yAxis: {
                        type: 'category',
                        data: yAxisData,
                        axisLabel: {
                            textStyle: {
                                fontWeight: 700,
                                fontSize: 18
                            }
                        }
                    },
                    grid: {
                        left: '10',
                        right: '30',
                        bottom: '10',
                        top: '10',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        axisLabel: {
                            textStyle: {
                                fontWeight: 700,
                                fontSize: 18
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

                // make description
                var dataMonth = parseInt(param.s_date.split("-")[1]);
                var itemStr = "";
                data = data.reverse();
                data.forEach(function (item, i) {
                    if (i < 3) {
                        itemStr += '<span class="describe-redText">“' + item.key + '” (' + item.value + ')</span>、';
                    }
                });
                itemStr = itemStr.substring(0, itemStr.length - 1);
                var description = '<div class="describe-text">' + dataMonth + '月份媒体报道情况，事故與情报道主要话题集中在'
                    + itemStr + '等几个事故。</div>';
                renderData.option = JSON.stringify(option);
                renderData.description = description;
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
                var total = 0, seriesData = [];
                for (var item of data) {
                    var node = {};
                    node.name = item.id;
                    node.value = item.count;
                    seriesData.push(node);
                    total += item.count;
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
                var itemStr = "";
                seriesData.forEach(function (item, i) {
                    if (i < 5) {
                        itemStr += "<span class='describe-redText'>" + item.name + "(" + (item.value * 100 / total).toFixed(2) + "%)</span>、";
                    }
                });
                itemStr = itemStr.substring(0, itemStr.length - 1) + "。";
                var description = "<div class='describe-text'>从本月安全生产事故类型来看，多发事故的类型为" + itemStr + "</div>";
                renderData.option = JSON.stringify(option);
                renderData.description = description;
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

                var description = "<div class='describe-text'>根据互联网抓取的数据，对数据载体进行分析，共抓取数据<span class='describe-redText'></span></div>";
                renderData.option = JSON.stringify(option);
                renderData.description = description;
            } else {
                console.log("get getAccidentMapChart data error");
            }
        });

        while (!isReturn) {
            deasync.runLoopOnce();
        }

        return renderData;
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

                var description = "<div class='describe-text'>根据互联网抓取的数据，对数据载体进行分析，共抓取数据<span class='describe-redText'></span></div>";
                renderData.option = JSON.stringify(option);
                renderData.description = description;
            } else {
                console.log("get getCommentPieChart data error");
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
            case 'weixin':
                target = '微信';
                break;
        }

        return target;
    },

    resetEmotionTypeName: function (source) {
        var type = '';
        source = source.toLowerCase();
        switch (source) {
            case 'pos':
                type = '正面';
                break;
            case 'neg':
                type = '负面';
                break;
            case 'neu':
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
