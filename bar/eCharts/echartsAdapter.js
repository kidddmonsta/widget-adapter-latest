function formatData(jsonUrl) {
    /*var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
*/

    return $.getJSON(jsonUrl).then(function (data) {
        //todo заполнять легенду названиями серий
        let legendDataNames = [];
        let series = [];
        let xAxis = [];
        var unformatteData = data.tableData.series;
        var seriesDataValues = [];
        console.log(data);
        //var filteredData = data.tableData.series;


        //Формируем массив Иксов и Значений серий
        filteredData.forEach(function (seria, index) {
            if (settings.customDimension == null) {
                console.log(settings.timeDimensionGranularity);
                switch (seria[settings.timeDimensionGranularity]) {
                    case "day":
                        xAxis[index] = moment(seria[settings.timeDimension]).format("YYYY-MM-DD");
                        break;
                    case "month":
                        xAxis[index] = moment(seria[settings.timeDimension]).format("YYYY-MM");
                        break;
                    case "year":
                        xAxis[index] = moment(seria[settings.timeDimension]).format("YYYY");
                        break;
                    default:
                        xAxis[index] = seria[settings.timeDimension];
                        break;
                }
            } else {
                xAxis[index] = seria[settings.customDimension];
            }
            settings.series.forEach(function (value, ind) {
                if (typeof seriesDataValues[value] == 'undefined') {
                    seriesDataValues[value] = [];
                }
                if (seria[value] == null) {
                    seriesDataValues[value][index] = 0;
                } else {
                    seriesDataValues[value][index] = seria[value];
                }
            });
        });

        function getPair(dimension, dimensionValue, filteredData) {
            var sdv = [], xAx = [];
            filteredData.forEach(function (seria, index) {
                var indexOfX = xAx.indexOf(seria[dimension]);
                if (indexOfX === -1) {
                    xAx.push(seria[dimension]);
                    if (seria[dimensionValue] == null) {
                        sdv.push(0);
                    } else {
                        sdv.push(seria[dimensionValue]);
                    }
                } else {
                    if (sdv[indexOfX] === 0 && seria[dimensionValue] !== null) {
                        sdv[indexOfX] = seria[dimensionValue];
                    }
                }
            });
            var result = [];
            result['xAxis'] = xAx;
            result[dimensionValue] = sdv;
            console.log(result);
            return result;
        }

        //Формируем серии для компонента графика @todo нужно брать имена на русском они в объекте data tableColumns есть

        function getRussianName(key, dataArray) {
            var result = "";
            dataArray.forEach(function (value, index) {
                if (value.key === key) {
                    result = value.titleRus
                }
            })
            return result
        }

        settings.series.forEach(function (value, ind) {
            var russianName = getRussianName(value, data.tableColumns);
            var dataValues = getPair(settings.customDimension, value, filteredData);
            xAxis = dataValues['xAxis'];
            series[ind] = {
                name: russianName,
                data: dataValues[value],
                type: 'bar',
                stack: 'total',
                symbol: settings.seriesSymbol,
                symbolSize: settings.seriesSymbolSize,
                lineStyle: {
                    type: settings.seriesLineStyleType
                }
            };
            legendDataNames[ind] = russianName;
        });
        var returnData = {
            legendDataNames: legendDataNames,
            series: series,
            xAxis: xAxis,
            unformatteData: filteredData
            //unformatteData: unformatteData
        };
        console.log(returnData);
        return returnData;
    });
}
