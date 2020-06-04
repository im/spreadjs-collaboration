var LegendPosition = GC.Spread.Sheets.Charts.LegendPosition;
var DataLabelPosition = GC.Spread.Sheets.Charts.DataLabelPosition;

function ChartLayoutPicker(container, selectedChartType, valueChanged) {
    this._container = container;
    this._valueChanged = valueChanged;
    this._selectedChartType = selectedChartType;
    this.options = {
        selectedChartType: "ColumnGroup",
        chartLayoutsData: {
            ColumnGroup: [
                {
                    name: "layout1",
                    description: "Layout1\n" +
                    "Chart Title\n" +
                    "Legend(Right)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout2",
                    description: "Layout2\n" +
                    "Chart Title\n" +
                    "Legend(Top)\n" +
                    "Horizontal Axis\n",
                    value: {
                        title: {
                            text: "Chart Title",
                        },
                        legend: {
                            position: LegendPosition.top,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.outsideEnd,
                            showValue: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: false,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout3",
                    description: "Layout3\n" +
                    "Chart Title\n" +
                    "Legend(Bottom)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.bottom,
                            visible: true
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout4",
                    description: "Layout4\n" +
                    "Legend(Bottom)\n" +
                    "DataLabels(Outside End)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis",
                    value: {
                        title: {
                            text: ""
                        },
                        legend: {
                            position: LegendPosition.bottom,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.outsideEnd,
                            showValue: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout5",
                    description: "Layout5\n" +
                    "Chart Title\n" +
                    "Vertical Axis Title\n" +
                    "DataLabels(Outside End)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: false
                        },
                        dataLabels: {
                            position: DataLabelPosition.outsideEnd,
                            showValue: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout6",
                    description: "Layout6\n" +
                    "Legend(Right)\n" +
                    "Horizontal Axis Title\n" +
                    "Vertical Axis Title\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines\n" +
                    "Minor Gridlines",
                    value: {
                        title: {
                            text: ""
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: true
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout7",
                    description: "Layout7\n" +
                    "Chart Title\n" +
                    "Horizontal Axis Title\n" +
                    "Vertical Axis Title\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: false
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout8",
                    description: "Layout8\n" +
                    "Chart Title\n" +
                    "Legend(Right)\n" +
                    "Horizontal Axis Title\n" +
                    "Vertical Axis Title\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout9",
                    description: "Layout9\n" +
                    "Chart Title\n" +
                    "Legend(Right)\n" +
                    "DataLabels(Inside End)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        dataLabels: {
                            position: DataLabelPosition.insideEnd,
                            showValue: true
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout10",
                    description: "Layout10\n" +
                    "Legend(Right)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: ""
                        },
                        dataLabels: {
                            position: DataLabelPosition.insideEnd,
                            showValue: false
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                }
            ],
            LineGroup: [
                {
                    name: "layout1",
                    description: "Layout1\n" +
                    "Chart Title\n" +
                    "Legend(Right)\n" +
                    "Vertical Axis Title\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout2",
                    description: "Layout2\n" +
                    "Chart Title\n" +
                    "Legend(Top)\n" +
                    "DataLabels(Center)\n" +
                    "Horizontal Axis\n",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.top,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.center,
                            showValue: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: false,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout3",
                    description: "Layout3\n" +
                    "Chart Title\n" +
                    "Legend(Bottom)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.bottom,
                            visible: true
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout4",
                    description: "Layout4\n" +
                    "Legend(Bottom)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis",
                    value: {
                        title: {
                            text: ""
                        },
                        legend: {
                            position: LegendPosition.bottom,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.outsideEnd,
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout5",
                    description: "Layout5\n" +
                    "Chart Title\n" +
                    "Vertical Axis Title\n" +
                    "DataLabels(Outside End)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: false
                        },
                        dataLabels: {
                            position: DataLabelPosition.outsideEnd,
                            showValue: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout6",
                    description: "Layout6\n" +
                    "Legend(Right)\n" +
                    "Horizontal Axis Title\n" +
                    "Vertical Axis Title\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines\n" +
                    "Minor Gridlines",
                    value: {
                        title: {
                            text: ""
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: true
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout7",
                    description: "Layout7\n" +
                    "Chart Title\n" +
                    "Legend(Bottom)\n" +
                    "DataLabels(Center)\n" +
                    "Horizontal Axis",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.bottom,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.outsideEnd,
                            showValue: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: false,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout8",
                    description: "Layout8\n" +
                    "Chart Title\n" +
                    "Legend(Right)\n" +
                    "DataLabels(Center)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.center,
                            showValue: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout9",
                    description: "Layout9\n" +
                    "Only Series",
                    value: {
                        title: {
                            text: ""
                        },
                        dataLabels: {
                            position: DataLabelPosition.insideEnd,
                            showValue: false
                        },
                        legend: {
                            visible: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: false,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: false,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout10",
                    description: "Layout10\n" +
                    "Legend(Right)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: ""
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                }
            ],
            PieGroup: [
                //todo:pie chart percentage
                {
                    name: "layout1",
                    description: "Layout1\n" +
                    "Chart Title\n" +
                    "Legend(Right)\n" +
                    "DataLabels(Value and Percentage)\n",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.center,
                            showValue: true,
                            showPercentage: true,
                            showCategoryName: false,
                            showSeriesName: false
                        }
                    }
                },
                {
                    name: "layout2",
                    description: "Layout2\n" +
                    "Chart Title\n" +
                    "Legend(Top)\n" +
                    "DataLabels(Value and Percentage)\n",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.top,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.center,
                            showValue: true,
                            showPercentage: true,
                            showCategoryName: false,
                            showSeriesName: false
                        }
                    }
                },
                {
                    name: "layout3",
                    description: "Layout3\n" +
                    "Chart Title\n" +
                    "Legend(Bottom)\n",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.bottom,
                            visible: true
                        },
                        dataLabels: {
                            showValue: false,
                            showPercentage: false,
                            showCategoryName: false,
                            showSeriesName: false
                        }
                    }
                },
                {
                    name: "layout4",
                    description: "Layout4\n" +
                    "Legend(Bottom)\n" +
                    "DataLabels(Category and Value)\n",
                    value: {
                        title: {
                            text: ""
                        },
                        legend: {
                            position: LegendPosition.bottom,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.center,
                            showValue: true,
                            showPercentage: false,
                            showCategoryName: true,
                            showSeriesName: false
                        }
                    }
                },
                {
                    name: "layout5",
                    description: "Layout5\n" +
                    "Chart Title\n" +
                    "DataLabels(Category)\n",
                    value: {
                        title: {
                            text: ""
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: false
                        },
                        dataLabels: {
                            position: DataLabelPosition.center,
                            showValue: false,
                            showPercentage: false,
                            showCategoryName: true,
                            showSeriesName: false
                        }
                    }
                },
                {
                    name: "layout6",
                    description: "Layout6\n" +
                    "Chart Title\n" +
                    "Legend(Right)\n",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            showValue: false,
                            showPercentage: false,
                            showCategoryName: false,
                            showSeriesName: false
                        }
                    }
                },
                {
                    name: "layout7",
                    description: "Layout7\n" +
                    "Chart Title\n" +
                    "Legend(Right)\n",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        dataLabels: {
                            position: DataLabelPosition.insideEnd,
                            showValue: false,
                            showPercentage: false,
                            showCategoryName: false,
                            showSeriesName: false
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        }
                    }
                }
            ],
            BarGroup: [
                {
                    name: "layout1",
                    description: "Layout1\n" +
                    "Chart Title\n" +
                    "Legend(Right)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout2",
                    description: "Layout2\n" +
                    "Chart Title\n" +
                    "Legend(Top)\n" +
                    "DataLabels(Outside End)\n" +
                    "Vertical Axis\n",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.top,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.outsideEnd,
                            showValue: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: false,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout3",
                    description: "Layout3\n" +
                    "Chart Title\n" +
                    "Legend(Bottom)\n" +
                    "DataLabels(Outside End)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.bottom,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.outsideEnd,
                            showValue: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout4",
                    description: "Layout4\n" +
                    "Legend(Bottom)\n" +
                    "DataLabels(Outside End)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis",
                    value: {
                        title: {
                            text: ""
                        },
                        legend: {
                            position: LegendPosition.bottom,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.outsideEnd,
                            showValue: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout5",
                    description: "Layout5\n" +
                    "Chart Title\n" +
                    "Horizontal Axis Title\n" +
                    "DataLabels(Outside End)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: false
                        },
                        dataLabels: {
                            position: DataLabelPosition.outsideEnd,
                            showValue: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout6",
                    description: "Layout6\n" +
                    "Legend(Right)\n" +
                    "Horizontal Axis Title\n" +
                    "Vertical Axis Title\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines\n" +
                    "Minor Gridlines",
                    value: {
                        title: {
                            text: ""
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: true
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout7",
                    description: "Layout7\n" +
                    "Chart Title\n" +
                    "Legend(Right)\n" +
                    "Horizontal Axis Title\n" +
                    "Vertical Axis Title\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.outsideEnd,
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout8",
                    description: "Layout8\n" +
                    "Chart Title\n" +
                    "Legend(Right)\n" +
                    "DataLabels(Inside End)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.insideEnd,
                            showValue: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout9",
                    description: "Layout9\n" +
                    "Legend(Right)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: ""
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                }
            ],
            AreaGroup: [
                {
                    name: "layout1",
                    description: "Layout1\n" +
                    "Chart Title\n" +
                    "Legend(Right)\n" +
                    "Vertical Axis Title\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout2",
                    description: "Layout2\n" +
                    "Chart Title\n" +
                    "Legend(Top)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines\n",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.top,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.outsideEnd,
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout3",
                    description: "Layout3\n" +
                    "Chart Title\n" +
                    "Legend(Bottom)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.bottom,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.outsideEnd,
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout4",
                    description: "Layout4\n" +
                    "Legend(Bottom)\n" +
                    "DataLabels(Outside End)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis",
                    value: {
                        title: {
                            text: ""
                        },
                        legend: {
                            position: LegendPosition.bottom,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.outsideEnd,
                            showValue: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout5",
                    description: "Layout5\n" +
                    "Chart Title\n" +
                    "Legend(Right)\n" +
                    "Horizontal Axis Title\n" +
                    "Vertical Axis Title\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines\n" +
                    "Minor Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.outsideEnd,
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: true
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout6",
                    description: "Layout6\n" +
                    "Chart Title\n" +
                    "Legend(Right)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines\n" +
                    "Minor Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: true
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout7",
                    description: "Layout7\n" +
                    "Legend(Right)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: ""
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.outsideEnd,
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                }
            ],
            ScatterGroup: [
                {
                    name: "layout1",
                    description: "Layout1\n" +
                    "Chart Title\n" +
                    "Legend(Right)\n" +
                    "Horizontal Axis Title\n" +
                    "Vertical Axis Title\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Vertical Axis Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout2",
                    description: "Layout2\n" +
                    "Chart Title\n" +
                    "Legend(Top)\n" +
                    "DataLabels(Center)\n" +
                    "Horizontal Axis\n",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.top,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.center,
                            showValue: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: false,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout3",
                    description: "Layout3\n" +
                    "Legend(Right)\n" +
                    "Horizontal Axis Title\n" +
                    "Vertical Axis Title\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Horizontal Axis Major Gridlines\n" +
                    "Horizontal Axis Minor Gridlines\n" +
                    "Vertical Axis Major Gridlines\n" +
                    "Vertical Axis Minor Gridlines",
                    value: {
                        title: {
                            text: ""
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: true
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: true
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout4",
                    description: "Layout4\n" +
                    "Legend(Bottom)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis",
                    value: {
                        title: {
                            text: ""
                        },
                        legend: {
                            position: LegendPosition.bottom,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.outsideEnd,
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout5",
                    description: "Layout5\n" +
                    "Chart Title\n" +
                    "Legend(Right)\n" +
                    "X and Y DataLabels(Above)\n" +
                    "Horizontal Axis Title\n" +
                    "Vertical Axis Title\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Vertical Axis Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.above,
                            showCategory: true,
                            showValue: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout6",
                    description: "Layout6\n" +
                    "Chart Title\n" +
                    "Legend(Right)\n" +
                    "Horizontal Axis Title\n" +
                    "Vertical Axis Title\n" +
                    "DataLabels(Above)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Vertical Axis Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.above,
                            showValue: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout7",
                    description: "Layout7\n" +
                    "Chart Title\n" +
                    "Legend(Right)\n" +
                    "X and Y DataLabels(Above)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis" +
                    "Horizontal Axis Major Gridlines\n" +
                    "Vertical Axis Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.above,
                            showCategory: true,
                            showValue: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout8",
                    description: "Layout8\n" +
                    "Chart Title\n" +
                    "Legend(Bottom)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Horizontal Axis Major Gridlines\n" +
                    "Vertical Axis Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.bottom,
                            visible: true
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: ""
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout9",
                    description: "Layout9\n" +
                    "Legend(Right)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Vertical Axis Major Gridlines",
                    value: {
                        title: {
                            text: ""
                        },
                        dataLabels: {
                            position: DataLabelPosition.insideEnd,
                            showValue: false
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                }
                            }
                        }
                    }
                }
            ],
            StockGroup: [
                {
                    name: "layout1",
                    description: "Layout1\n" +
                    "Chart Title\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: false
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout2",
                    description: "Layout2\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis",
                    value: {
                        title: {
                            text: ""
                        },
                        legend: {
                            position: LegendPosition.top,
                            visible: false
                        },
                        dataLabels: {
                            position: DataLabelPosition.center,
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout3",
                    description: "Layout3\n" +
                    "Horizontal Axis Title\n" +
                    "Vertical Axis Title\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines\n" +
                    "Minor Gridlines",
                    value: {
                        title: {
                            text: ""
                        },
                        legend: {
                            position: LegendPosition.bottom,
                            visible: false
                        },
                        dataLabels: {
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: true
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout4",
                    description: "Layout4\n" +
                    "Chart Title\n" +
                    "Horizontal Axis Title\n" +
                    "Vertical Axis Title\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: "Chart Title"
                        },
                        legend: {
                            position: LegendPosition.bottom,
                            visible: false
                        },
                        dataLabels: {
                            position: DataLabelPosition.center,
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                },
                                title: {
                                    text: "Axis Title"
                                }
                            }
                        }
                    }
                },
                {
                    name: "layout5",
                    description: "Layout5\n" +
                    "Legend(Right)\n" +
                    "Horizontal Axis\n" +
                    "Vertical Axis\n" +
                    "Major Gridlines",
                    value: {
                        title: {
                            text: ""
                        },
                        legend: {
                            position: LegendPosition.right,
                            visible: true
                        },
                        dataLabels: {
                            position: DataLabelPosition.outsideEnd,
                            showValue: false
                        },
                        axes: {
                            primaryCategory: {
                                visible: true,
                                majorGridLine: {
                                    visible: false
                                },
                                minorGridLine: {
                                    visible: false
                                }
                            },
                            primaryValue: {
                                visible: true,
                                majorGridLine: {
                                    visible: true
                                },
                                minorGridLine: {
                                    visible: false
                                }
                            }
                        }
                    }
                }
            ]
        }
    };
    this._createChartLayoutPicker();
}

ChartLayoutPicker.prototype._createChartLayoutPicker = function () {
    var self = this;
    var selectedChartType = self._selectedChartType || self.options.selectedChartType;
    self._createChartLayout(selectedChartType);
    self._container.bind("selectstart", function () {
        return false;
    });
};

ChartLayoutPicker.prototype._createChartLayout = function (selectedChartType) {
    var self = this;
    var options = self.options;
    if (!selectedChartType && !options.chartLayoutsData[selectedChartType]) {
        return;
    }
    self._detachEvent();
    self._container.empty();
    var list = $("<ul class='chart-layout-list'></ul>");
    list.addClass("chart-layout-" + selectedChartType);
    var chartLayoutsData = options.chartLayoutsData[selectedChartType];
    for (var i = 0; i < chartLayoutsData.length; i++) {
        var chartLayout = self._createChartLayoutListItem(selectedChartType, chartLayoutsData[i]);
        chartLayout.appendTo(list);
    }
    list.appendTo(self._container);
    self._addEventsListener();
};

ChartLayoutPicker.prototype._setOption = function (selectedChartType) {
    var self = this;
    self._selectedChartType = selectedChartType;
    self._createChartLayout(selectedChartType);
};

ChartLayoutPicker.prototype._createChartLayoutListItem = function (selectedChartType, chartLayoutData) {
    var chartLayout = $("<li class='chart-layout-list-item'></li>");
    var iconSpan = $("<span></span>");
    iconSpan.addClass("chart-layout-icon");
    iconSpan.addClass(chartLayoutData.name);
    chartLayout.attr("title", chartLayoutData.description);
    chartLayout.attr("data-name", selectedChartType);
    iconSpan.appendTo(chartLayout);
    return chartLayout;
};

ChartLayoutPicker.prototype._addEventsListener = function () {
    var _this = this;
    _this._container.find(".chart-layout-list-item").on('mouseover.chartlayoutpicker', function (evt) {
        _this._container.find(".chart-layout-list-item").removeClass("chart-layout-hover");
        $(evt.currentTarget).addClass("chart-layout-hover");
    });
    _this._container.find(".chart-layout-list-item").on('mousedown.chartlayoutpicker', function (evt) {
        var layoutItems = _this._container.find(".chart-layout-list-item");
        layoutItems.removeClass("chart-layout-selected");
        $(evt.currentTarget).addClass("chart-layout-selected");
        var selectedChartType = $(evt.currentTarget).data('name');
        var layoutOptionsIndex = layoutItems.index($(evt.currentTarget));
        var layoutOptions = _this.options.chartLayoutsData[selectedChartType][layoutOptionsIndex].value;
        _this._raiseValueChanged(evt, layoutOptions);
    });
    _this._container.find(".chart-layout-list-item").click(function () {
        console.log('test');
    });
};

ChartLayoutPicker.prototype._raiseValueChanged = function (evt, layoutOptions) {
    var self = this;
    if (self._valueChanged && self._valueChanged instanceof Function) {
        self._valueChanged.call(self, evt, layoutOptions);
    }
};

ChartLayoutPicker.prototype.dispose = function () {
    this._detachEvent();
    this._container = null;
    this._valueChanged = null;
    this._options = null;
};

ChartLayoutPicker.prototype._detachEvent = function () {
    this._container.find(".chart-layout-list-item").off("chartlayoutpicker");
};

