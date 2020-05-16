(function () {
    'use strict';
    var designer = GC.Spread.Sheets.Designer;
    designer.chartTemplates = {
        chartColors: {
            colorful: {
                name: 'Colorful',
                colors: [
                    {
                        tip: 'Blue, Orange, Gray, Gold, Blue, Green',
                        items: ['accent 1', 'accent 2', 'accent 3', 'accent 4', 'accent 5', 'accent 6']
                    },
                    {
                        tip: 'Blue, Gray, Blue, Dark Blue, Dark Gray, Dark Blue',
                        items: ['accent 1', 'accent 3', 'accent 5', 'accent 1 -40', 'accent 3 -40', 'accent 5 -40']
                    },
                    {
                        tip: 'Orange, Gold, Green, Brown, Dark Yellow, Dark Green',
                        items: ['accent 2', 'accent 4', 'accent 6', 'accent 2 -40', 'accent 4 -40', 'accent 6 -40']
                    },
                    {
                        tip: 'Green, Blue, Gold, Dark Green, Dark Blue, Dark Yellow',
                        items: ['accent 6', 'accent 5', 'accent 4', 'accent 6 -40', 'accent 5 -40', 'accent 4 -40']
                    }
                ]
            },
            monochromatic: {
                name: 'Monochromatic',
                colors: [
                    {
                        tip: 'Blue gradient, dark to light',
                        items: { startColor: 'accent 1 -50', stopColor: 'accent 1 50' }
                    },
                    {
                        tip: 'Orange gradient, dark to light',
                        items: { startColor: 'accent 2 -50', stopColor: 'accent 2 50' }
                    },
                    {
                        tip: 'Gray gradient, dark to light',
                        items: { startColor: 'accent 3 -50', stopColor: 'accent 3 50' }
                    },
                    {
                        tip: 'Gold gradient, dark to light',
                        items: { startColor: 'accent 4 -50', stopColor: 'accent 4 50' }
                    },
                    {
                        tip: 'Blue gradient, dark to light',
                        items: { startColor: 'accent 5 -50', stopColor: 'accent 5 50' }
                    },
                    {
                        tip: 'Green gradient, dark to light',
                        items: { startColor: 'accent 6 -50', stopColor: 'accent 6 50' }
                    },
                    {
                        tip: 'Dark Gray, Light Gray, Gray, Dark Gray, Light Gray, Gray',
                        items: ['text 1 11.5', 'text 1 45', 'text 1 25', 'text 1 1.5', 'text 1 70', 'text 1 40']
                    },
                    {
                        tip: 'Blue gradient, light to dark',
                        items: { startColor: 'accent 1 50', stopColor: 'accent 1 -50' }
                    },
                    {
                        tip: 'Orange gradient, light to dark',
                        items: { startColor: 'accent 2 50', stopColor: 'accent 2 -50' }
                    },
                    {
                        tip: 'Gray gradient, light to dark',
                        items: { startColor: 'accent 3 50', stopColor: 'accent 3 -50' }
                    },
                    {
                        tip: 'Gold gradient, light to dark',
                        items: { startColor: 'accent 4 50', stopColor: 'accent 4 -50' }
                    },
                    {
                        tip: 'Blue gradient, light to dark',
                        items: { startColor: 'accent 5 50', stopColor: 'accent 5 -50' }
                    },
                    {
                        tip: 'Green gradient, light to dark',
                        items: { startColor: 'accent 6 50', stopColor: 'accent 6 -50' }
                    }
                ]
            }
        },
        chartStyles: {
            columnClustered: [
                null,
                // {
                //     series: {
                //         backColor: "halfTransparent"
                //     }
                // }, 
                {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                // {
                //     series: {
                //         backColor: "transparent",
                //         border: {
                //             color: "seriesBackColor",
                //             width: 2
                //         }
                //     }
                // }, 
                {
                    legend: {
                        position: 1
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    },
                    // series: {
                    //     backColor: "transparent",
                    //     border: {
                    //         color: "seriesBackColor",
                    //         width: 2
                    //     }
                    // },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            columnStacked: [
                null,
                // {
                //     series: {
                //         backColor: "halfTransparent"
                //     }
                // }, 
                {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }, {
                    legend: {
                        position: 1
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            columnStacked100: [
                null,
                // {
                //     series: {
                //         backColor: "halfTransparent"
                //     }
                // }, 
                {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }, {
                    legend: {
                        position: 1
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            line: [
                null, {
                    dataLabels: {
                        showValue: true
                    }
                }, {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }, {
                    legend: {
                        position: 1
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            lineStacked: [
                null, {
                    dataLabels: {
                        showValue: true
                    }
                }, {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }, {
                    legend: {
                        position: 1
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            lineStacked100: [
                null, {
                    dataLabels: {
                        showValue: true
                    }
                }, {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }, {
                    legend: {
                        position: 1
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            lineMarkers: [
                null, {
                    dataLabels: {
                        showValue: true
                    }
                }, {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }, {
                    legend: {
                        position: 1
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            lineMarkersStacked: [
                null, {
                    dataLabels: {
                        showValue: true
                    }
                }, {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }, {
                    legend: {
                        position: 1
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            lineMarkersStacked100: [
                null, {
                    dataLabels: {
                        showValue: true
                    }
                }, {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }, {
                    legend: {
                        position: 1
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            pie: [
                null,
                // {
                //     series: {
                //         backColor: "halfTransparent"
                //     }
                // }, 
                {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(187,255,255,1)"
                    },
                    // series: {
                    //     backColor: "rgba(255,255,255,1)",
                    //     border: {
                    //         color: "transparent",
                    //         width: 2
                    //     }
                    // },
                    dataLabels: {
                        showValue: true
                    }
                }, {
                    legend: {
                        position: 1
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            doughnut: [
                null,
                // {
                //     series: {
                //         backColor: "halfTransparent"
                //     }
                // },  
                {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }, {
                    legend: {
                        position: 1
                    }
                }
            ],
            barClustered: [
                null,
                // {
                //     series: {
                //         backColor: "halfTransparent"
                //     }
                // }, 
                {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                // {
                //     series: {
                //         backColor: "transparent",
                //         border: {
                //             color: "seriesBackColor",
                //             width: 2
                //         }
                //     }
                // }, 
                {
                    legend: {
                        position: 1
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    },
                    // series: {
                    //     backColor: "transparent"
                    // },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            barStacked: [
                null,
                // {
                //     series: {
                //         backColor: "halfTransparent"
                //     }
                // }, 
                {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                // {
                //     series: {
                //         backColor: "transparent",
                //         border: {
                //             color: "seriesBackColor",
                //             width: 2
                //         }
                //     }
                // }, 
                {
                    legend: {
                        position: 1
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    },
                    // series: {
                    //     backColor: "transparent"
                    // },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            barStacked100: [
                null,
                // {
                //     series: {
                //         backColor: "halfTransparent"
                //     }
                // }, 
                {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                // {
                //     series: {
                //         backColor: "transparent",
                //         border: {
                //             color: "seriesBackColor",
                //             width: 2
                //         }
                //     }
                // }, 
                {
                    legend: {
                        position: 1
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    },
                    // series: {
                    //     backColor: "transparent"
                    // },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            area: [
                null,
                // {
                //     series: {
                //         backColor: "halfTransparent"
                //     }
                // }, 
                {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                // {
                //     series: {
                //         backColor: "transparent",
                //         border: {
                //             color: "seriesBackColor",
                //             width: 2
                //         }
                //     }
                // }, 
                {
                    legend: {
                        position: 1
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            areaStacked: [
                null,
                // {
                //     series: {
                //         backColor: "halfTransparent"
                //     }
                // }, 
                {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                // {
                //     series: {
                //         backColor: "transparent",
                //         border: {
                //             color: "seriesBackColor",
                //             width: 2
                //         }
                //     }
                // }, 
                {
                    legend: {
                        position: 1
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            areaStacked100: [
                null,
                // {
                //     series: {
                //         backColor: "halfTransparent"
                //     }
                // }, 
                {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                // {
                //     series: {
                //         backColor: "transparent",
                //         border: {
                //             color: "seriesBackColor",
                //             width: 2
                //         }
                //     }
                // }, 
                {
                    legend: {
                        position: 1
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            xyScatter: [
                null,
                // {
                //     series: {
                //         backColor: "halfTransparent"
                //     }
                // }, 
                {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                // {
                //     series: {
                //         backColor: "transparent",
                //         border: {
                //             color: "seriesBackColor",
                //             width: 2
                //         }
                //     }
                // }, 
                {
                    legend: {
                        position: 1
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    },
                    // series: {
                    //     backColor: "transparent"
                    // },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            xyScatterSmooth: [
                null,
                // {
                //     series: {
                //         backColor: "halfTransparent"
                //     }
                // }, 
                {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                // {
                //     series: {
                //         backColor: "transparent",
                //         border: {
                //             color: "seriesBackColor",
                //             width: 2
                //         }
                //     }
                // },
                {
                    legend: {
                        position: 1
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    },
                    // series: {
                    //     backColor: "transparent"
                    // },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            xyScatterSmoothNoMarkers: [
                null,
                // {
                // series: {
                //     backColor: "halfTransparent"
                // }
                // }, 
                {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                // {
                //     series: {
                //         backColor: "transparent",
                //         border: {
                //             color: "seriesBackColor",
                //             width: 2
                //         }
                //     }
                // },
                {
                    legend: {
                        position: 1
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    },
                    // series: {
                    //     backColor: "transparent"
                    // },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            xyScatterLines: [
                null,
                // {
                //     series: {
                //         backColor: "halfTransparent"
                //     }
                // }, 
                {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                // {
                //     series: {
                //         backColor: "transparent",
                //         border: {
                //             color: "seriesBackColor",
                //             width: 2
                //         }
                //     }
                // }, 
                {
                    legend: {
                        position: 1
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    },
                    // series: {
                    //     backColor: "transparent"
                    // },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            xyScatterLinesNoMarkers: [
                null,
                // {
                //     series: {
                //         backColor: "halfTransparent"
                //     }
                // }, 
                {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                // {
                //     series: {
                //         backColor: "transparent",
                //         border: {
                //             color: "seriesBackColor",
                //             width: 2
                //         }
                //     }
                // }, 
                {
                    legend: {
                        position: 1
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    },
                    // series: {
                    //     backColor: "transparent"
                    // },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            bubble: [
                null,
                // {
                //     series: {
                //         backColor: "halfTransparent"
                //     }
                // }, 
                {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                // {
                //     series: {
                //         backColor: "transparent",
                //         border: {
                //             color: "seriesBackColor",
                //             width: 2
                //         }
                //     }
                // }, 
                {
                    legend: {
                        position: 1
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    },
                    // series: {
                    //     backColor: "transparent"
                    // },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ],
            stockHLC: [
                null,
                {
                    axes: {
                        primaryValue: {
                            minorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(91,155,213,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }
            ],
            stockOHLC: [
                null,
                {
                    axes: {
                        primaryValue: {
                            minorGridLine: {
                                visible: true
                            }
                        }
                    }
                },
                // {
                //     chartArea: {
                //         backColor: "rgba(93,93,93,1)",
                //         color: "rgba(255,255,255,1)"
                //     }
                // },
                {
                    chartArea: {
                        backColor: "rgba(91,155,213,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }
            ],
            stockVHLC: [
                null,
                {
                    axes: {
                        primaryValue: {
                            minorGridLine: {
                                visible: true
                            }
                        }
                    }
                },
                // {
                //     chartArea: {
                //         backColor: "rgba(93,93,93,1)",
                //         color: "rgba(255,255,255,1)"
                //     }
                // },
                {
                    chartArea: {
                        backColor: "rgba(91,155,213,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }
            ],
            stockVOHLC: [
                null,
                {
                    axes: {
                        primaryValue: {
                            minorGridLine: {
                                visible: true
                            }
                        }
                    }
                },
                // {
                //     chartArea: {
                //         backColor: "rgba(93,93,93,1)",
                //         color: "rgba(255,255,255,1)"
                //     }
                // },
                {
                    chartArea: {
                        backColor: "rgba(91,155,213,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }
            ],
            radar: [
                {
                    legend: {
                        position: 1
                    },
                    series: {
                        border: {
                            width: 3,
                        }
                    }
                },
                {
                    legend: {
                        position: 4
                    },
                    series: {
                        border: {
                            width: 1,
                        }
                    }
                },
                {
                    series: {
                        border: {
                            width: 5,
                        }
                    },
                    chartArea: {
                        backColor: "rgba(242,242,242,1)",
                        color: "rgba(5,0,0,1)"
                    }
                },
                {
                    series: {
                        border: {
                            width: 4,
                        }
                    },
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                {
                    legend: {
                        position: 4
                    },
                    title: {
                        fontSize: 25
                    }
                },
                {
                    title: {
                        fontSize: 25
                    },
                    series: {
                        border: {
                            width: 5
                        }
                    },
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }
            ],
            radarMarkers: [
                {
                    legend: {
                        position: 1
                    },
                    series: {
                        border: {
                            width: 3,
                        }
                    }
                },
                {
                    legend: {
                        position: 4
                    },
                    series: {
                        border: {
                            width: 1,
                        }
                    }
                },
                {
                    series: {
                        border: {
                            width: 5,
                        }
                    },
                    chartArea: {
                        backColor: "rgba(242,242,242,1)",
                        color: "rgba(5,0,0,1)"
                    }
                },
                {
                    series: {
                        border: {
                            width: 4,
                        }
                    },
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                {
                    legend: {
                        position: 4
                    },
                    title: {
                        fontSize: 25
                    }
                },
                {
                    title: {
                        fontSize: 25
                    },
                    series: {
                        border: {
                            width: 5
                        }
                    },
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }
            ],
            radarFilled: [
                {
                    legend: {
                        position: 1
                    },
                    series: {
                        border: {
                            width: 3,
                        }
                    }
                },
                {
                    legend: {
                        position: 4
                    },
                    series: {
                        border: {
                            width: 1,
                        }
                    }
                },
                {
                    series: {
                        border: {
                            width: 5,
                        }
                    },
                    chartArea: {
                        backColor: "rgba(242,242,242,1)",
                        color: "rgba(5,0,0,1)"
                    }
                },
                {
                    series: {
                        border: {
                            width: 4,
                        }
                    },
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                {
                    legend: {
                        position: 4
                    },
                    title: {
                        fontSize: 25
                    }
                },
                {
                    title: {
                        fontSize: 25
                    },
                    series: {
                        border: {
                            width: 5
                        }
                    },
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }
            ],
            sunburst: [
                {
                    dataLabels: {
                        showCategoryName: true
                    },
                    chartArea: {
                        color: "rgba(255,255,255,1)"
                    }
                },
                {
                    dataLabels: {
                        showCategoryName: true
                    },
                    series: {
                        border: {
                            width: 5,
                        }
                    },
                    legend: {
                        position: 2,
                        backColor: "rgba(242,242,242,1)"
                    },
                    chartArea: {
                        backColor: "rgba(242,242,242,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                {
                    dataLabels: {
                        showCategoryName: true
                    },
                    title: {
                        fontSize: 25
                    },
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }
            ],
            treemap: [
                {
                    dataLabels: {
                        showCategoryName: true
                    },
                    chartArea: {
                        color: "rgba(255,255,255,1)"
                    }
                },
                {
                    dataLabels: {
                        showCategoryName: true
                    },
                    chartArea: {
                        backColor: "rgba(242,242,242,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                {
                    dataLabels: {
                        showCategoryName: true
                    },
                    title: {
                        fontSize: 25,
                    },
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                }
            ],
            combo: [
                null,
                // {
                //     series: {
                //         backColor: "halfTransparent"
                //     }
                // }, 
                {
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    }
                },
                // {
                //     series: {
                //         backColor: "transparent",
                //         border: {
                //             color: "seriesBackColor",
                //             width: 2
                //         }
                //     }
                // }, 
                {
                    legend: {
                        position: 1
                    }
                }, {
                    chartArea: {
                        backColor: "rgba(93,93,93,1)",
                        color: "rgba(255,255,255,1)"
                    },
                    // series: {
                    //     backColor: "transparent",
                    //     border: {
                    //         color: "seriesBackColor",
                    //         width: 2
                    //     }
                    // },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        }
                    }
                }, {
                    legend: {
                        position: 1
                    },
                    axes: {
                        primaryCategory: {
                            majorGridLine: {
                                visible: true
                            }
                        },
                        primaryValue: {
                            majorGridLine: {
                                visible: false
                            },
                            style: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    },
                    dataLabels: {
                        showValue: true
                    }
                }
            ]
        }
    };
})();