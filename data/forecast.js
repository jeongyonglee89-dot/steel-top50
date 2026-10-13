// 자동 생성 파일 — scripts/forecast_model.py (FRED·OECD + 패널 회귀). 직접 수정 금지.
window.STEEL_FORECAST = {
 "status": "ready",
 "statusNote": "패널 회귀(기업 고정효과) · 추정 2023~2025 · FRED·OECD 거시지표",
 "baseYear": 2025,
 "years": [
  2026,
  2027,
  2028
 ],
 "scenarios": [
  "bear",
  "base",
  "bull"
 ],
 "generatedAt": "2026-10-13",
 "models": {
  "crude": {
   "label": "조강 증가율",
   "r2": 0.003,
   "r2Within": null,
   "adjR2": -0.017,
   "n": 100,
   "firms": 50,
   "spec": "풀링 OLS",
   "coef": [
    {
     "name": "GDP 성장률(%p)",
     "beta": 0.3536,
     "se": 0.7316,
     "t": 0.48
    },
    {
     "name": "중국 더미",
     "beta": -1.2759,
     "se": 2.7607,
     "t": -0.46
    }
   ]
  },
  "ebitda": {
   "label": "EBITDA 마진",
   "r2": 0.835,
   "r2Within": 0.043,
   "adjR2": 0.747,
   "n": 96,
   "firms": 32,
   "spec": "회사 고정효과",
   "coef": [
    {
     "name": "철광석가격 변화율(%p)",
     "beta": 0.1286,
     "se": 0.0927,
     "t": 1.39
    },
    {
     "name": "GDP 성장률(%p)",
     "beta": 0.4204,
     "se": 0.4533,
     "t": 0.93
    }
   ]
  },
  "opm": {
   "label": "영업이익률",
   "r2": 0.88,
   "r2Within": 0.128,
   "adjR2": 0.816,
   "n": 96,
   "firms": 32,
   "spec": "회사 고정효과",
   "coef": [
    {
     "name": "철광석가격 변화율(%p)",
     "beta": 0.2273,
     "se": 0.0754,
     "t": 3.01
    },
    {
     "name": "GDP 성장률(%p)",
     "beta": 0.0176,
     "se": 0.3689,
     "t": 0.05
    }
   ]
  },
  "pbr": {
   "label": "PBR",
   "r2": 0.899,
   "r2Within": 0.081,
   "adjR2": 0.845,
   "n": 96,
   "firms": 32,
   "spec": "회사 고정효과",
   "coef": [
    {
     "name": "EBITDA 마진(%p)",
     "beta": 0.025,
     "se": 0.0119,
     "t": 2.1
    },
    {
     "name": "GDP 성장률(%p)",
     "beta": -0.0547,
     "se": 0.0434,
     "t": -1.26
    }
   ]
  }
 },
 "assumptions": {
  "bear": {
   "2026": {
    "oreChg": -8.43,
    "gdpWorld": 2.82,
    "gdpChina": 3.84,
    "gdpUSA": 1.76
   },
   "2027": {
    "oreChg": -21.38,
    "gdpWorld": 2.87,
    "gdpChina": 2.86,
    "gdpUSA": 1.43
   },
   "2028": {
    "oreChg": -21.38,
    "gdpWorld": 2.87,
    "gdpChina": 2.86,
    "gdpUSA": 1.43
   }
  },
  "base": {
   "2026": {
    "oreChg": 2.26,
    "gdpWorld": 2.93,
    "gdpChina": 4.54,
    "gdpUSA": 1.95
   },
   "2027": {
    "oreChg": 0.0,
    "gdpWorld": 3.09,
    "gdpChina": 4.25,
    "gdpUSA": 1.8
   },
   "2028": {
    "oreChg": 0.0,
    "gdpWorld": 3.09,
    "gdpChina": 4.25,
    "gdpUSA": 1.8
   }
  },
  "bull": {
   "2026": {
    "oreChg": 12.95,
    "gdpWorld": 3.04,
    "gdpChina": 5.24,
    "gdpUSA": 2.14
   },
   "2027": {
    "oreChg": 21.38,
    "gdpWorld": 3.31,
    "gdpChina": 5.65,
    "gdpUSA": 2.17
   },
   "2028": {
    "oreChg": 21.38,
    "gdpWorld": 3.31,
    "gdpChina": 5.65,
    "gdpUSA": 2.17
   }
  }
 },
 "sources": [
  "FRED PIORECRUSDM (Iron ore, IMF)",
  "OECD Economic Outlook 119 (Real GDP growth)"
 ],
 "companies": {
  "baowu": {
   "2026": {
    "bear": {
     "crude": 126.39,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       107.77,
       148.22
      ],
      "opIncomeUsdMn": [
       -164.2,
       2793.0
      ],
      "ebitdaPct": [
       5.3,
       12.9
      ],
      "pbr": [
       0.42,
       1.14
      ]
     },
     "opIncomeUsdMn": 1314.4,
     "opMarginPct": 2.7,
     "ebitdaPct": 9.1,
     "pbr": 0.78,
     "dps": 0.1852,
     "dpsCcy": "CNY",
     "payoutPct": 66.8
    },
    "base": {
     "crude": 126.7,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       108.04,
       148.58
      ],
      "opIncomeUsdMn": [
       1011.6,
       3975.9
      ],
      "ebitdaPct": [
       7.0,
       14.6
      ],
      "pbr": [
       0.43,
       1.15
      ]
     },
     "opIncomeUsdMn": 2493.7,
     "opMarginPct": 5.2,
     "ebitdaPct": 10.8,
     "pbr": 0.79,
     "dps": 0.3514,
     "dpsCcy": "CNY",
     "payoutPct": 66.8
    },
    "bull": {
     "crude": 127.01,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       108.31,
       148.95
      ],
      "opIncomeUsdMn": [
       2193.0,
       5164.6
      ],
      "ebitdaPct": [
       8.7,
       16.2
      ],
      "pbr": [
       0.43,
       1.15
      ]
     },
     "opIncomeUsdMn": 3678.8,
     "opMarginPct": 7.6,
     "ebitdaPct": 12.5,
     "pbr": 0.79,
     "dps": 0.5183,
     "dpsCcy": "CNY",
     "payoutPct": 66.8
    }
   },
   "2027": {
    "bear": {
     "crude": 127.59,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       101.85,
       159.83
      ],
      "opIncomeUsdMn": [
       -1601.4,
       1383.8
      ],
      "ebitdaPct": [
       3.3,
       10.8
      ],
      "pbr": [
       0.42,
       1.14
      ]
     },
     "opIncomeUsdMn": -108.8,
     "opMarginPct": -0.2,
     "ebitdaPct": 7.1,
     "pbr": 0.78,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 66.8
    },
    "base": {
     "crude": 128.54,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       102.61,
       161.02
      ],
      "opIncomeUsdMn": [
       773.0,
       3780.2
      ],
      "ebitdaPct": [
       6.6,
       14.2
      ],
      "pbr": [
       0.43,
       1.15
      ]
     },
     "opIncomeUsdMn": 2276.6,
     "opMarginPct": 4.7,
     "ebitdaPct": 10.4,
     "pbr": 0.79,
     "dps": 0.3208,
     "dpsCcy": "CNY",
     "payoutPct": 66.8
    },
    "bull": {
     "crude": 129.49,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       103.37,
       162.22
      ],
      "opIncomeUsdMn": [
       3182.4,
       6211.5
      ],
      "ebitdaPct": [
       9.9,
       17.5
      ],
      "pbr": [
       0.44,
       1.16
      ]
     },
     "opIncomeUsdMn": 4696.9,
     "opMarginPct": 9.5,
     "ebitdaPct": 13.7,
     "pbr": 0.8,
     "dps": 0.62,
     "dpsCcy": "CNY",
     "payoutPct": 66.8
    }
   },
   "2028": {
    "bear": {
     "crude": 128.81,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       97.75,
       169.74
      ],
      "opIncomeUsdMn": [
       -1616.6,
       1396.9
      ],
      "ebitdaPct": [
       3.3,
       10.8
      ],
      "pbr": [
       0.42,
       1.14
      ]
     },
     "opIncomeUsdMn": -109.9,
     "opMarginPct": -0.2,
     "ebitdaPct": 7.1,
     "pbr": 0.78,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 66.8
    },
    "base": {
     "crude": 130.41,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       98.96,
       171.85
      ],
      "opIncomeUsdMn": [
       784.2,
       3834.6
      ],
      "ebitdaPct": [
       6.6,
       14.2
      ],
      "pbr": [
       0.43,
       1.15
      ]
     },
     "opIncomeUsdMn": 2309.4,
     "opMarginPct": 4.7,
     "ebitdaPct": 10.4,
     "pbr": 0.79,
     "dps": 0.3254,
     "dpsCcy": "CNY",
     "payoutPct": 66.8
    },
    "bull": {
     "crude": 132.02,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       100.19,
       173.98
      ],
      "opIncomeUsdMn": [
       3243.9,
       6331.6
      ],
      "ebitdaPct": [
       9.9,
       17.5
      ],
      "pbr": [
       0.44,
       1.16
      ]
     },
     "opIncomeUsdMn": 4787.8,
     "opMarginPct": 9.5,
     "ebitdaPct": 13.7,
     "pbr": 0.8,
     "dps": 0.62,
     "dpsCcy": "CNY",
     "payoutPct": 66.8
    }
   }
  },
  "arcelormittal": {
   "2026": {
    "bear": {
     "crude": 64.85,
     "crudeGrowthPct": 2.2,
     "pi80": {
      "crude": [
       55.3,
       76.05
      ],
      "opIncomeUsdMn": [
       -247.4,
       3611.9
      ],
      "ebitdaPct": [
       4.9,
       12.5
      ],
      "pbr": [
       0.13,
       0.85
      ]
     },
     "opIncomeUsdMn": 1682.3,
     "opMarginPct": 2.7,
     "ebitdaPct": 8.7,
     "pbr": 0.49,
     "dps": 0.3659,
     "dpsCcy": "USD",
     "payoutPct": 27.7
    },
    "base": {
     "crude": 64.87,
     "crudeGrowthPct": 2.2,
     "pi80": {
      "crude": [
       55.32,
       76.08
      ],
      "opIncomeUsdMn": [
       1277.9,
       5138.7
      ],
      "ebitdaPct": [
       6.3,
       13.9
      ],
      "pbr": [
       0.16,
       0.88
      ]
     },
     "opIncomeUsdMn": 3208.3,
     "opMarginPct": 5.1,
     "ebitdaPct": 10.1,
     "pbr": 0.52,
     "dps": 0.6978,
     "dpsCcy": "USD",
     "payoutPct": 27.7
    },
    "bull": {
     "crude": 64.9,
     "crudeGrowthPct": 2.3,
     "pi80": {
      "crude": [
       55.34,
       76.11
      ],
      "opIncomeUsdMn": [
       2804.3,
       6666.6
      ],
      "ebitdaPct": [
       7.8,
       15.3
      ],
      "pbr": [
       0.19,
       0.91
      ]
     },
     "opIncomeUsdMn": 4735.5,
     "opMarginPct": 7.5,
     "ebitdaPct": 11.5,
     "pbr": 0.55,
     "dps": 1.0299,
     "dpsCcy": "USD",
     "payoutPct": 27.7
    }
   },
   "2027": {
    "bear": {
     "crude": 66.31,
     "crudeGrowthPct": 2.2,
     "pi80": {
      "crude": [
       52.93,
       83.06
      ],
      "opIncomeUsdMn": [
       -2138.6,
       1806.7
      ],
      "ebitdaPct": [
       3.3,
       10.8
      ],
      "pbr": [
       0.08,
       0.8
      ]
     },
     "opIncomeUsdMn": -166.0,
     "opMarginPct": -0.3,
     "ebitdaPct": 7.1,
     "pbr": 0.44,
     "dps": 0.0,
     "dpsCcy": "USD",
     "payoutPct": 27.7
    },
    "base": {
     "crude": 66.39,
     "crudeGrowthPct": 2.3,
     "pi80": {
      "crude": [
       52.99,
       83.16
      ],
      "opIncomeUsdMn": [
       980.0,
       4929.9
      ],
      "ebitdaPct": [
       6.1,
       13.7
      ],
      "pbr": [
       0.14,
       0.86
      ]
     },
     "opIncomeUsdMn": 2954.9,
     "opMarginPct": 4.6,
     "ebitdaPct": 9.9,
     "pbr": 0.5,
     "dps": 0.6427,
     "dpsCcy": "USD",
     "payoutPct": 27.7
    },
    "bull": {
     "crude": 66.46,
     "crudeGrowthPct": 2.4,
     "pi80": {
      "crude": [
       53.06,
       83.26
      ],
      "opIncomeUsdMn": [
       4105.8,
       8060.2
      ],
      "ebitdaPct": [
       9.0,
       16.5
      ],
      "pbr": [
       0.2,
       0.92
      ]
     },
     "opIncomeUsdMn": 6083.0,
     "opMarginPct": 9.5,
     "ebitdaPct": 12.7,
     "pbr": 0.56,
     "dps": 1.1,
     "dpsCcy": "USD",
     "payoutPct": 27.7
    }
   },
   "2028": {
    "bear": {
     "crude": 67.8,
     "crudeGrowthPct": 2.2,
     "pi80": {
      "crude": [
       51.45,
       89.35
      ],
      "opIncomeUsdMn": [
       -2186.2,
       1846.9
      ],
      "ebitdaPct": [
       3.3,
       10.8
      ],
      "pbr": [
       0.08,
       0.8
      ]
     },
     "opIncomeUsdMn": -169.7,
     "opMarginPct": -0.3,
     "ebitdaPct": 7.1,
     "pbr": 0.44,
     "dps": 0.0,
     "dpsCcy": "USD",
     "payoutPct": 27.7
    },
    "base": {
     "crude": 67.94,
     "crudeGrowthPct": 2.3,
     "pi80": {
      "crude": [
       51.55,
       89.52
      ],
      "opIncomeUsdMn": [
       1002.6,
       5043.5
      ],
      "ebitdaPct": [
       6.1,
       13.7
      ],
      "pbr": [
       0.14,
       0.86
      ]
     },
     "opIncomeUsdMn": 3023.1,
     "opMarginPct": 4.6,
     "ebitdaPct": 9.9,
     "pbr": 0.5,
     "dps": 0.6575,
     "dpsCcy": "USD",
     "payoutPct": 27.7
    },
    "bull": {
     "crude": 68.07,
     "crudeGrowthPct": 2.4,
     "pi80": {
      "crude": [
       51.65,
       89.7
      ],
      "opIncomeUsdMn": [
       4203.7,
       8252.5
      ],
      "ebitdaPct": [
       9.0,
       16.5
      ],
      "pbr": [
       0.2,
       0.92
      ]
     },
     "opIncomeUsdMn": 6228.1,
     "opMarginPct": 9.5,
     "ebitdaPct": 12.7,
     "pbr": 0.56,
     "dps": 1.1,
     "dpsCcy": "USD",
     "payoutPct": 27.7
    }
   }
  },
  "nipponsteel": {
   "2026": {
    "bear": {
     "crude": 58.54,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       49.92,
       68.65
      ],
      "opIncomeUsdMn": [
       1547.9,
       5501.9
      ],
      "ebitdaPct": [
       6.5,
       14.0
      ],
      "pbr": [
       0.27,
       0.99
      ]
     },
     "opIncomeUsdMn": 3524.9,
     "opMarginPct": 5.5,
     "ebitdaPct": 10.3,
     "pbr": 0.63,
     "dps": 25.5363,
     "dpsCcy": "JPY",
     "payoutPct": 58.0
    },
    "base": {
     "crude": 58.61,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       49.98,
       68.73
      ],
      "opIncomeUsdMn": [
       3116.9,
       7076.0
      ],
      "ebitdaPct": [
       8.0,
       15.6
      ],
      "pbr": [
       0.29,
       1.01
      ]
     },
     "opIncomeUsdMn": 5096.4,
     "opMarginPct": 7.9,
     "ebitdaPct": 11.8,
     "pbr": 0.65,
     "dps": 36.9214,
     "dpsCcy": "JPY",
     "payoutPct": 58.0
    },
    "bull": {
     "crude": 58.69,
     "crudeGrowthPct": 1.6,
     "pi80": {
      "crude": [
       50.04,
       68.82
      ],
      "opIncomeUsdMn": [
       4689.9,
       8654.0
      ],
      "ebitdaPct": [
       9.5,
       17.1
      ],
      "pbr": [
       0.3,
       1.02
      ]
     },
     "opIncomeUsdMn": 6672.0,
     "opMarginPct": 10.4,
     "ebitdaPct": 13.3,
     "pbr": 0.66,
     "dps": 48.3352,
     "dpsCcy": "JPY",
     "payoutPct": 58.0
    }
   },
   "2027": {
    "bear": {
     "crude": 59.26,
     "crudeGrowthPct": 1.2,
     "pi80": {
      "crude": [
       47.3,
       74.23
      ],
      "opIncomeUsdMn": [
       -349.3,
       3653.1
      ],
      "ebitdaPct": [
       4.7,
       12.3
      ],
      "pbr": [
       0.24,
       0.96
      ]
     },
     "opIncomeUsdMn": 1651.9,
     "opMarginPct": 2.5,
     "ebitdaPct": 8.5,
     "pbr": 0.6,
     "dps": 11.967,
     "dpsCcy": "JPY",
     "payoutPct": 58.0
    },
    "base": {
     "crude": 59.48,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       47.48,
       74.52
      ],
      "opIncomeUsdMn": [
       2829.8,
       6847.5
      ],
      "ebitdaPct": [
       7.8,
       15.3
      ],
      "pbr": [
       0.27,
       0.99
      ]
     },
     "opIncomeUsdMn": 4838.6,
     "opMarginPct": 7.4,
     "ebitdaPct": 11.6,
     "pbr": 0.63,
     "dps": 35.0537,
     "dpsCcy": "JPY",
     "payoutPct": 58.0
    },
    "bull": {
     "crude": 59.72,
     "crudeGrowthPct": 1.7,
     "pi80": {
      "crude": [
       47.67,
       74.81
      ],
      "opIncomeUsdMn": [
       6033.2,
       10066.1
      ],
      "ebitdaPct": [
       10.8,
       18.4
      ],
      "pbr": [
       0.31,
       1.03
      ]
     },
     "opIncomeUsdMn": 8049.7,
     "opMarginPct": 12.3,
     "ebitdaPct": 14.6,
     "pbr": 0.67,
     "dps": 58.3161,
     "dpsCcy": "JPY",
     "payoutPct": 58.0
    }
   },
   "2028": {
    "bear": {
     "crude": 59.98,
     "crudeGrowthPct": 1.2,
     "pi80": {
      "crude": [
       45.52,
       79.05
      ],
      "opIncomeUsdMn": [
       -353.6,
       3697.7
      ],
      "ebitdaPct": [
       4.7,
       12.3
      ],
      "pbr": [
       0.24,
       0.96
      ]
     },
     "opIncomeUsdMn": 1672.1,
     "opMarginPct": 2.5,
     "ebitdaPct": 8.5,
     "pbr": 0.6,
     "dps": 12.1132,
     "dpsCcy": "JPY",
     "payoutPct": 58.0
    },
    "base": {
     "crude": 60.37,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       45.81,
       79.56
      ],
      "opIncomeUsdMn": [
       2871.7,
       6948.8
      ],
      "ebitdaPct": [
       7.8,
       15.3
      ],
      "pbr": [
       0.27,
       0.99
      ]
     },
     "opIncomeUsdMn": 4910.2,
     "opMarginPct": 7.4,
     "ebitdaPct": 11.6,
     "pbr": 0.63,
     "dps": 35.5723,
     "dpsCcy": "JPY",
     "payoutPct": 58.0
    },
    "bull": {
     "crude": 60.76,
     "crudeGrowthPct": 1.7,
     "pi80": {
      "crude": [
       46.11,
       80.07
      ],
      "opIncomeUsdMn": [
       6138.0,
       10241.0
      ],
      "ebitdaPct": [
       10.8,
       18.4
      ],
      "pbr": [
       0.31,
       1.03
      ]
     },
     "opIncomeUsdMn": 8189.5,
     "opMarginPct": 12.3,
     "ebitdaPct": 14.6,
     "pbr": 0.67,
     "dps": 59.329,
     "dpsCcy": "JPY",
     "payoutPct": 58.0
    }
   }
  },
  "ansteel": {
   "2026": {
    "bear": {
     "crude": 58.36,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       49.77,
       68.44
      ],
      "opIncomeUsdMn": [
       -1246.5,
       -351.9
      ],
      "ebitdaPct": [
       -5.4,
       2.2
      ],
      "pbr": [
       0.17,
       0.89
      ]
     },
     "opIncomeUsdMn": -799.2,
     "opMarginPct": -5.5,
     "ebitdaPct": -1.6,
     "pbr": 0.53
    },
    "base": {
     "crude": 58.51,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       49.89,
       68.61
      ],
      "opIncomeUsdMn": [
       -893.7,
       3.1
      ],
      "ebitdaPct": [
       -3.7,
       3.8
      ],
      "pbr": [
       0.17,
       0.89
      ]
     },
     "opIncomeUsdMn": -445.3,
     "opMarginPct": -3.1,
     "ebitdaPct": 0.1,
     "pbr": 0.53
    },
    "bull": {
     "crude": 58.65,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       50.01,
       68.78
      ],
      "opIncomeUsdMn": [
       -539.2,
       359.8
      ],
      "ebitdaPct": [
       -2.0,
       5.5
      ],
      "pbr": [
       0.17,
       0.89
      ]
     },
     "opIncomeUsdMn": -89.7,
     "opMarginPct": -0.6,
     "ebitdaPct": 1.7,
     "pbr": 0.53
    }
   },
   "2027": {
    "bear": {
     "crude": 58.92,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       47.03,
       73.81
      ],
      "opIncomeUsdMn": [
       -1692.6,
       -789.5
      ],
      "ebitdaPct": [
       -7.5,
       0.1
      ],
      "pbr": [
       0.17,
       0.89
      ]
     },
     "opIncomeUsdMn": -1241.1,
     "opMarginPct": -8.5,
     "ebitdaPct": -3.7,
     "pbr": 0.53
    },
    "base": {
     "crude": 59.36,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       47.38,
       74.35
      ],
      "opIncomeUsdMn": [
       -983.1,
       -73.4
      ],
      "ebitdaPct": [
       -4.1,
       3.4
      ],
      "pbr": [
       0.18,
       0.89
      ]
     },
     "opIncomeUsdMn": -528.3,
     "opMarginPct": -3.6,
     "ebitdaPct": -0.3,
     "pbr": 0.53
    },
    "bull": {
     "crude": 59.8,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       47.73,
       74.91
      ],
      "opIncomeUsdMn": [
       -263.2,
       653.2
      ],
      "ebitdaPct": [
       -0.8,
       6.8
      ],
      "pbr": [
       0.18,
       0.9
      ]
     },
     "opIncomeUsdMn": 195.0,
     "opMarginPct": 1.3,
     "ebitdaPct": 3.0,
     "pbr": 0.54
    }
   },
   "2028": {
    "bear": {
     "crude": 59.48,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       45.14,
       78.38
      ],
      "opIncomeUsdMn": [
       -1708.6,
       -797.0
      ],
      "ebitdaPct": [
       -7.5,
       0.1
      ],
      "pbr": [
       0.17,
       0.89
      ]
     },
     "opIncomeUsdMn": -1252.8,
     "opMarginPct": -8.5,
     "ebitdaPct": -3.7,
     "pbr": 0.53
    },
    "base": {
     "crude": 60.22,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       45.7,
       79.35
      ],
      "opIncomeUsdMn": [
       -997.3,
       -74.5
      ],
      "ebitdaPct": [
       -4.1,
       3.4
      ],
      "pbr": [
       0.18,
       0.89
      ]
     },
     "opIncomeUsdMn": -535.9,
     "opMarginPct": -3.6,
     "ebitdaPct": -0.3,
     "pbr": 0.53
    },
    "bull": {
     "crude": 60.96,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       46.26,
       80.34
      ],
      "opIncomeUsdMn": [
       -268.2,
       665.8
      ],
      "ebitdaPct": [
       -0.8,
       6.8
      ],
      "pbr": [
       0.18,
       0.9
      ]
     },
     "opIncomeUsdMn": 198.8,
     "opMarginPct": 1.3,
     "ebitdaPct": 3.0,
     "pbr": 0.54
    }
   }
  },
  "hbis": {
   "2026": {
    "bear": {
     "crude": 43.04,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       36.71,
       50.48
      ],
      "opIncomeUsdMn": [
       236.9,
       1337.2
      ],
      "ebitdaPct": [
       6.9,
       14.5
      ],
      "pbr": [
       0.08,
       0.8
      ]
     },
     "opIncomeUsdMn": 787.0,
     "opMarginPct": 4.4,
     "ebitdaPct": 10.7,
     "pbr": 0.44,
     "dps": 0.0307,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 43.15,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       36.8,
       50.6
      ],
      "opIncomeUsdMn": [
       675.1,
       1778.0
      ],
      "ebitdaPct": [
       8.6,
       16.1
      ],
      "pbr": [
       0.08,
       0.8
      ]
     },
     "opIncomeUsdMn": 1226.6,
     "opMarginPct": 6.8,
     "ebitdaPct": 12.4,
     "pbr": 0.44,
     "dps": 0.0478,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 43.26,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       36.89,
       50.73
      ],
      "opIncomeUsdMn": [
       1115.4,
       2221.1
      ],
      "ebitdaPct": [
       10.3,
       17.8
      ],
      "pbr": [
       0.08,
       0.8
      ]
     },
     "opIncomeUsdMn": 1668.2,
     "opMarginPct": 9.3,
     "ebitdaPct": 14.0,
     "pbr": 0.44,
     "dps": 0.065,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    }
   },
   "2027": {
    "bear": {
     "crude": 43.45,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       34.69,
       54.44
      ],
      "opIncomeUsdMn": [
       -295.1,
       815.7
      ],
      "ebitdaPct": [
       4.8,
       12.4
      ],
      "pbr": [
       0.08,
       0.8
      ]
     },
     "opIncomeUsdMn": 260.3,
     "opMarginPct": 1.4,
     "ebitdaPct": 8.6,
     "pbr": 0.44,
     "dps": 0.0101,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 43.78,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       34.95,
       54.84
      ],
      "opIncomeUsdMn": [
       590.6,
       1709.5
      ],
      "ebitdaPct": [
       8.2,
       15.7
      ],
      "pbr": [
       0.09,
       0.8
      ]
     },
     "opIncomeUsdMn": 1150.1,
     "opMarginPct": 6.3,
     "ebitdaPct": 12.0,
     "pbr": 0.44,
     "dps": 0.0448,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 44.1,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       35.21,
       55.25
      ],
      "opIncomeUsdMn": [
       1489.3,
       2616.3
      ],
      "ebitdaPct": [
       11.5,
       19.1
      ],
      "pbr": [
       0.09,
       0.81
      ]
     },
     "opIncomeUsdMn": 2052.8,
     "opMarginPct": 11.2,
     "ebitdaPct": 15.3,
     "pbr": 0.45,
     "dps": 0.0799,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    }
   },
   "2028": {
    "bear": {
     "crude": 43.87,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       33.29,
       57.81
      ],
      "opIncomeUsdMn": [
       -297.9,
       823.4
      ],
      "ebitdaPct": [
       4.8,
       12.4
      ],
      "pbr": [
       0.08,
       0.8
      ]
     },
     "opIncomeUsdMn": 262.8,
     "opMarginPct": 1.4,
     "ebitdaPct": 8.6,
     "pbr": 0.44,
     "dps": 0.0102,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 44.41,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       33.7,
       58.53
      ],
      "opIncomeUsdMn": [
       599.1,
       1734.1
      ],
      "ebitdaPct": [
       8.2,
       15.7
      ],
      "pbr": [
       0.09,
       0.8
      ]
     },
     "opIncomeUsdMn": 1166.6,
     "opMarginPct": 6.3,
     "ebitdaPct": 12.0,
     "pbr": 0.44,
     "dps": 0.0454,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 44.96,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       34.12,
       59.25
      ],
      "opIncomeUsdMn": [
       1518.1,
       2667.0
      ],
      "ebitdaPct": [
       11.5,
       19.1
      ],
      "pbr": [
       0.09,
       0.81
      ]
     },
     "opIncomeUsdMn": 2092.5,
     "opMarginPct": 11.2,
     "ebitdaPct": 15.3,
     "pbr": 0.45,
     "dps": 0.08,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    }
   }
  },
  "shagang": {
   "2026": {
    "bear": {
     "crude": 39.61,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       33.78,
       46.45
      ],
      "opIncomeUsdMn": [
       -47.8,
       74.4
      ],
      "ebitdaPct": [
       3.7,
       11.3
      ],
      "pbr": [
       1.45,
       2.17
      ]
     },
     "opIncomeUsdMn": 13.3,
     "opMarginPct": 0.7,
     "ebitdaPct": 7.5,
     "pbr": 1.81,
     "dps": 0.0188,
     "dpsCcy": "CNY",
     "payoutPct": 71.4
    },
    "base": {
     "crude": 39.71,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       33.86,
       46.57
      ],
      "opIncomeUsdMn": [
       0.7,
       123.2
      ],
      "ebitdaPct": [
       5.4,
       12.9
      ],
      "pbr": [
       1.46,
       2.18
      ]
     },
     "opIncomeUsdMn": 61.9,
     "opMarginPct": 3.1,
     "ebitdaPct": 9.2,
     "pbr": 1.82,
     "dps": 0.0875,
     "dpsCcy": "CNY",
     "payoutPct": 71.4
    },
    "bull": {
     "crude": 39.81,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       33.94,
       46.68
      ],
      "opIncomeUsdMn": [
       49.4,
       172.2
      ],
      "ebitdaPct": [
       7.1,
       14.6
      ],
      "pbr": [
       1.46,
       2.18
      ]
     },
     "opIncomeUsdMn": 110.8,
     "opMarginPct": 5.6,
     "ebitdaPct": 10.8,
     "pbr": 1.82,
     "dps": 0.15,
     "dpsCcy": "CNY",
     "payoutPct": 71.4
    }
   },
   "2027": {
    "bear": {
     "crude": 39.99,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       31.92,
       50.09
      ],
      "opIncomeUsdMn": [
       -107.6,
       15.8
      ],
      "ebitdaPct": [
       1.6,
       9.2
      ],
      "pbr": [
       1.45,
       2.17
      ]
     },
     "opIncomeUsdMn": -45.9,
     "opMarginPct": -2.3,
     "ebitdaPct": 5.4,
     "pbr": 1.81,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 71.4
    },
    "base": {
     "crude": 40.28,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       32.16,
       50.46
      ],
      "opIncomeUsdMn": [
       -9.8,
       114.5
      ],
      "ebitdaPct": [
       5.0,
       12.5
      ],
      "pbr": [
       1.46,
       2.18
      ]
     },
     "opIncomeUsdMn": 52.4,
     "opMarginPct": 2.6,
     "ebitdaPct": 8.8,
     "pbr": 1.82,
     "dps": 0.0739,
     "dpsCcy": "CNY",
     "payoutPct": 71.4
    },
    "bull": {
     "crude": 40.58,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       32.4,
       50.84
      ],
      "opIncomeUsdMn": [
       89.5,
       214.7
      ],
      "ebitdaPct": [
       8.3,
       15.9
      ],
      "pbr": [
       1.47,
       2.19
      ]
     },
     "opIncomeUsdMn": 152.1,
     "opMarginPct": 7.5,
     "ebitdaPct": 12.1,
     "pbr": 1.83,
     "dps": 0.15,
     "dpsCcy": "CNY",
     "payoutPct": 71.4
    }
   },
   "2028": {
    "bear": {
     "crude": 40.37,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       30.63,
       53.2
      ],
      "opIncomeUsdMn": [
       -108.6,
       15.9
      ],
      "ebitdaPct": [
       1.6,
       9.2
      ],
      "pbr": [
       1.45,
       2.17
      ]
     },
     "opIncomeUsdMn": -46.4,
     "opMarginPct": -2.3,
     "ebitdaPct": 5.4,
     "pbr": 1.81,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 71.4
    },
    "base": {
     "crude": 40.87,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       31.01,
       53.86
      ],
      "opIncomeUsdMn": [
       -9.9,
       116.1
      ],
      "ebitdaPct": [
       5.0,
       12.5
      ],
      "pbr": [
       1.46,
       2.18
      ]
     },
     "opIncomeUsdMn": 53.1,
     "opMarginPct": 2.6,
     "ebitdaPct": 8.8,
     "pbr": 1.82,
     "dps": 0.075,
     "dpsCcy": "CNY",
     "payoutPct": 71.4
    },
    "bull": {
     "crude": 41.38,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       31.4,
       54.53
      ],
      "opIncomeUsdMn": [
       91.2,
       218.8
      ],
      "ebitdaPct": [
       8.3,
       15.9
      ],
      "pbr": [
       1.47,
       2.19
      ]
     },
     "opIncomeUsdMn": 155.0,
     "opMarginPct": 7.5,
     "ebitdaPct": 12.1,
     "pbr": 1.83,
     "dps": 0.15,
     "dpsCcy": "CNY",
     "payoutPct": 71.4
    }
   }
  },
  "jianlong": {
   "2026": {
    "bear": {
     "crude": 38.52,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       32.84,
       45.17
      ]
     }
    },
    "base": {
     "crude": 38.61,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       32.92,
       45.28
      ]
     }
    },
    "bull": {
     "crude": 38.71,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       33.01,
       45.39
      ]
     }
    }
   },
   "2027": {
    "bear": {
     "crude": 38.88,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       31.04,
       48.71
      ]
     }
    },
    "base": {
     "crude": 39.17,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       31.27,
       49.07
      ]
     }
    },
    "bull": {
     "crude": 39.46,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       31.5,
       49.44
      ]
     }
    }
   },
   "2028": {
    "bear": {
     "crude": 39.25,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       29.79,
       51.73
      ]
     }
    },
    "base": {
     "crude": 39.74,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       30.16,
       52.37
      ]
     }
    },
    "bull": {
     "crude": 40.23,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       30.53,
       53.02
      ]
     }
    }
   }
  },
  "posco": {
   "2026": {
    "bear": {
     "crude": 38.12,
     "crudeGrowthPct": 2.0,
     "pi80": {
      "crude": [
       32.5,
       44.7
      ],
      "opIncomeUsdMn": [
       -247.6,
       2975.1
      ],
      "ebitdaPct": [
       5.3,
       12.9
      ],
      "pbr": [
       0.08,
       0.8
      ]
     },
     "opIncomeUsdMn": 1363.8,
     "opMarginPct": 2.6,
     "ebitdaPct": 9.1,
     "pbr": 0.44,
     "dps": 6511.6726,
     "dpsCcy": "KRW",
     "payoutPct": 74.3
    },
    "base": {
     "crude": 38.17,
     "crudeGrowthPct": 2.1,
     "pi80": {
      "crude": [
       32.55,
       44.76
      ],
      "opIncomeUsdMn": [
       1029.6,
       4256.5
      ],
      "ebitdaPct": [
       6.8,
       14.4
      ],
      "pbr": [
       0.1,
       0.82
      ]
     },
     "opIncomeUsdMn": 2643.0,
     "opMarginPct": 5.0,
     "ebitdaPct": 10.6,
     "pbr": 0.46,
     "dps": 12619.8301,
     "dpsCcy": "KRW",
     "payoutPct": 74.3
    },
    "bull": {
     "crude": 38.22,
     "crudeGrowthPct": 2.3,
     "pi80": {
      "crude": [
       32.59,
       44.82
      ],
      "opIncomeUsdMn": [
       2310.1,
       5541.3
      ],
      "ebitdaPct": [
       8.4,
       15.9
      ],
      "pbr": [
       0.12,
       0.84
      ]
     },
     "opIncomeUsdMn": 3925.7,
     "opMarginPct": 7.5,
     "ebitdaPct": 12.2,
     "pbr": 0.48,
     "dps": 18744.2006,
     "dpsCcy": "KRW",
     "payoutPct": 74.3
    }
   },
   "2027": {
    "bear": {
     "crude": 38.74,
     "crudeGrowthPct": 1.6,
     "pi80": {
      "crude": [
       30.93,
       48.53
      ],
      "opIncomeUsdMn": [
       -1827.5,
       1447.6
      ],
      "ebitdaPct": [
       3.2,
       10.7
      ],
      "pbr": [
       0.09,
       0.81
      ]
     },
     "opIncomeUsdMn": -189.9,
     "opMarginPct": -0.4,
     "ebitdaPct": 7.0,
     "pbr": 0.45,
     "dps": 0.0,
     "dpsCcy": "KRW",
     "payoutPct": 74.3
    },
    "base": {
     "crude": 38.9,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       31.05,
       48.73
      ],
      "opIncomeUsdMn": [
       768.6,
       4056.8
      ],
      "ebitdaPct": [
       6.3,
       13.8
      ],
      "pbr": [
       0.12,
       0.84
      ]
     },
     "opIncomeUsdMn": 2412.7,
     "opMarginPct": 4.5,
     "ebitdaPct": 10.0,
     "pbr": 0.48,
     "dps": 11520.1274,
     "dpsCcy": "KRW",
     "payoutPct": 74.3
    },
    "bull": {
     "crude": 39.06,
     "crudeGrowthPct": 2.2,
     "pi80": {
      "crude": [
       31.18,
       48.93
      ],
      "opIncomeUsdMn": [
       3385.5,
       6686.9
      ],
      "ebitdaPct": [
       9.3,
       16.9
      ],
      "pbr": [
       0.16,
       0.88
      ]
     },
     "opIncomeUsdMn": 5036.2,
     "opMarginPct": 9.4,
     "ebitdaPct": 13.1,
     "pbr": 0.52,
     "dps": 20000,
     "dpsCcy": "KRW",
     "payoutPct": 74.3
    }
   },
   "2028": {
    "bear": {
     "crude": 39.38,
     "crudeGrowthPct": 1.6,
     "pi80": {
      "crude": [
       29.88,
       51.89
      ],
      "opIncomeUsdMn": [
       -1857.3,
       1471.2
      ],
      "ebitdaPct": [
       3.2,
       10.7
      ],
      "pbr": [
       0.09,
       0.81
      ]
     },
     "opIncomeUsdMn": -193.0,
     "opMarginPct": -0.4,
     "ebitdaPct": 7.0,
     "pbr": 0.45,
     "dps": 0.0,
     "dpsCcy": "KRW",
     "payoutPct": 74.3
    },
    "base": {
     "crude": 39.65,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       30.09,
       52.25
      ],
      "opIncomeUsdMn": [
       783.2,
       4133.9
      ],
      "ebitdaPct": [
       6.3,
       13.8
      ],
      "pbr": [
       0.12,
       0.84
      ]
     },
     "opIncomeUsdMn": 2458.5,
     "opMarginPct": 4.5,
     "ebitdaPct": 10.0,
     "pbr": 0.48,
     "dps": 11738.961,
     "dpsCcy": "KRW",
     "payoutPct": 74.3
    },
    "bull": {
     "crude": 39.92,
     "crudeGrowthPct": 2.2,
     "pi80": {
      "crude": [
       30.29,
       52.6
      ],
      "opIncomeUsdMn": [
       3459.0,
       6832.0
      ],
      "ebitdaPct": [
       9.3,
       16.9
      ],
      "pbr": [
       0.16,
       0.88
      ]
     },
     "opIncomeUsdMn": 5145.5,
     "opMarginPct": 9.4,
     "ebitdaPct": 13.1,
     "pbr": 0.52,
     "dps": 20000,
     "dpsCcy": "KRW",
     "payoutPct": 74.3
    }
   }
  },
  "delong": {
   "2026": {
    "bear": {
     "crude": 32.45,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       27.67,
       38.05
      ]
     }
    },
    "base": {
     "crude": 32.53,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       27.74,
       38.15
      ]
     }
    },
    "bull": {
     "crude": 32.61,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       27.81,
       38.24
      ]
     }
    }
   },
   "2027": {
    "bear": {
     "crude": 32.76,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       26.15,
       41.03
      ]
     }
    },
    "base": {
     "crude": 33.0,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       26.34,
       41.34
      ]
     }
    },
    "bull": {
     "crude": 33.25,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       26.54,
       41.65
      ]
     }
    }
   },
   "2028": {
    "bear": {
     "crude": 33.07,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       25.09,
       43.58
      ]
     }
    },
    "base": {
     "crude": 33.48,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       25.41,
       44.12
      ]
     }
    },
    "bull": {
     "crude": 33.89,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       25.72,
       44.67
      ]
     }
    }
   }
  },
  "tatasteel": {
   "2026": {
    "bear": {
     "crude": 31.46,
     "crudeGrowthPct": 3.2,
     "pi80": {
      "crude": [
       26.82,
       36.89
      ],
      "opIncomeUsdMn": [
       853.3,
       2389.4
      ],
      "ebitdaPct": [
       6.5,
       14.1
      ],
      "pbr": [
       1.89,
       2.61
      ]
     },
     "opIncomeUsdMn": 1621.4,
     "opMarginPct": 6.5,
     "ebitdaPct": 10.3,
     "pbr": 2.25,
     "dps": 4.0471,
     "dpsCcy": "INR",
     "payoutPct": 70.8
    },
    "base": {
     "crude": 31.52,
     "crudeGrowthPct": 3.4,
     "pi80": {
      "crude": [
       26.88,
       36.97
      ],
      "opIncomeUsdMn": [
       1465.4,
       3004.7
      ],
      "ebitdaPct": [
       8.2,
       15.7
      ],
      "pbr": [
       1.9,
       2.62
      ]
     },
     "opIncomeUsdMn": 2235.1,
     "opMarginPct": 8.9,
     "ebitdaPct": 11.9,
     "pbr": 2.26,
     "dps": 5.579,
     "dpsCcy": "INR",
     "payoutPct": 70.8
    },
    "bull": {
     "crude": 31.59,
     "crudeGrowthPct": 3.6,
     "pi80": {
      "crude": [
       26.94,
       37.05
      ],
      "opIncomeUsdMn": [
       2080.0,
       3622.5
      ],
      "ebitdaPct": [
       9.8,
       17.4
      ],
      "pbr": [
       1.9,
       2.62
      ]
     },
     "opIncomeUsdMn": 2851.3,
     "opMarginPct": 11.4,
     "ebitdaPct": 13.6,
     "pbr": 2.26,
     "dps": 7.1172,
     "dpsCcy": "INR",
     "payoutPct": 70.8
    }
   },
   "2027": {
    "bear": {
     "crude": 32.43,
     "crudeGrowthPct": 3.0,
     "pi80": {
      "crude": [
       25.89,
       40.62
      ],
      "opIncomeUsdMn": [
       120.4,
       1703.3
      ],
      "ebitdaPct": [
       4.7,
       12.2
      ],
      "pbr": [
       1.87,
       2.59
      ]
     },
     "opIncomeUsdMn": 911.8,
     "opMarginPct": 3.5,
     "ebitdaPct": 8.5,
     "pbr": 2.23,
     "dps": 2.276,
     "dpsCcy": "INR",
     "payoutPct": 70.8
    },
    "base": {
     "crude": 32.64,
     "crudeGrowthPct": 3.5,
     "pi80": {
      "crude": [
       26.05,
       40.89
      ],
      "opIncomeUsdMn": [
       1384.2,
       2977.1
      ],
      "ebitdaPct": [
       7.9,
       15.5
      ],
      "pbr": [
       1.88,
       2.6
      ]
     },
     "opIncomeUsdMn": 2180.6,
     "opMarginPct": 8.4,
     "ebitdaPct": 11.7,
     "pbr": 2.24,
     "dps": 5.4431,
     "dpsCcy": "INR",
     "payoutPct": 70.8
    },
    "bull": {
     "crude": 32.85,
     "crudeGrowthPct": 3.9,
     "pi80": {
      "crude": [
       26.22,
       41.15
      ],
      "opIncomeUsdMn": [
       2663.8,
       4266.6
      ],
      "ebitdaPct": [
       11.2,
       18.8
      ],
      "pbr": [
       1.9,
       2.62
      ]
     },
     "opIncomeUsdMn": 3465.2,
     "opMarginPct": 13.3,
     "ebitdaPct": 15.0,
     "pbr": 2.26,
     "dps": 7.2,
     "dpsCcy": "INR",
     "payoutPct": 70.8
    }
   },
   "2028": {
    "bear": {
     "crude": 33.43,
     "crudeGrowthPct": 3.0,
     "pi80": {
      "crude": [
       25.37,
       44.06
      ],
      "opIncomeUsdMn": [
       124.0,
       1755.2
      ],
      "ebitdaPct": [
       4.7,
       12.2
      ],
      "pbr": [
       1.87,
       2.59
      ]
     },
     "opIncomeUsdMn": 939.6,
     "opMarginPct": 3.5,
     "ebitdaPct": 8.5,
     "pbr": 2.23,
     "dps": 2.3454,
     "dpsCcy": "INR",
     "payoutPct": 70.8
    },
    "base": {
     "crude": 33.79,
     "crudeGrowthPct": 3.5,
     "pi80": {
      "crude": [
       25.64,
       44.53
      ],
      "opIncomeUsdMn": [
       1432.4,
       3080.6
      ],
      "ebitdaPct": [
       7.9,
       15.5
      ],
      "pbr": [
       1.88,
       2.6
      ]
     },
     "opIncomeUsdMn": 2256.5,
     "opMarginPct": 8.4,
     "ebitdaPct": 11.7,
     "pbr": 2.24,
     "dps": 5.6324,
     "dpsCcy": "INR",
     "payoutPct": 70.8
    },
    "bull": {
     "crude": 34.16,
     "crudeGrowthPct": 3.9,
     "pi80": {
      "crude": [
       25.92,
       45.01
      ],
      "opIncomeUsdMn": [
       2767.9,
       4433.2
      ],
      "ebitdaPct": [
       11.2,
       18.8
      ],
      "pbr": [
       1.9,
       2.62
      ]
     },
     "opIncomeUsdMn": 3600.5,
     "opMarginPct": 13.3,
     "ebitdaPct": 15.0,
     "pbr": 2.26,
     "dps": 7.2,
     "dpsCcy": "INR",
     "payoutPct": 70.8
    }
   }
  },
  "jsw": {
   "2026": {
    "bear": {
     "crude": 31.27,
     "crudeGrowthPct": 3.2,
     "pi80": {
      "crude": [
       26.66,
       36.67
      ],
      "opIncomeUsdMn": [
       1411.1,
       2625.3
      ],
      "ebitdaPct": [
       13.8,
       21.4
      ],
      "pbr": [
       2.57,
       3.29
      ]
     },
     "opIncomeUsdMn": 2018.2,
     "opMarginPct": 10.2,
     "ebitdaPct": 17.6,
     "pbr": 2.93,
     "dps": 4.0791,
     "dpsCcy": "INR",
     "payoutPct": 21.1
    },
    "base": {
     "crude": 31.34,
     "crudeGrowthPct": 3.4,
     "pi80": {
      "crude": [
       26.72,
       36.75
      ],
      "opIncomeUsdMn": [
       1896.4,
       3113.2
      ],
      "ebitdaPct": [
       15.4,
       23.0
      ],
      "pbr": [
       2.58,
       3.3
      ]
     },
     "opIncomeUsdMn": 2504.8,
     "opMarginPct": 12.7,
     "ebitdaPct": 19.2,
     "pbr": 2.94,
     "dps": 5.0627,
     "dpsCcy": "INR",
     "payoutPct": 21.1
    },
    "bull": {
     "crude": 31.4,
     "crudeGrowthPct": 3.6,
     "pi80": {
      "crude": [
       26.78,
       36.83
      ],
      "opIncomeUsdMn": [
       2383.8,
       3603.1
      ],
      "ebitdaPct": [
       17.1,
       24.6
      ],
      "pbr": [
       2.58,
       3.3
      ]
     },
     "opIncomeUsdMn": 2993.4,
     "opMarginPct": 15.1,
     "ebitdaPct": 20.8,
     "pbr": 2.94,
     "dps": 6.0503,
     "dpsCcy": "INR",
     "payoutPct": 21.1
    }
   },
   "2027": {
    "bear": {
     "crude": 32.24,
     "crudeGrowthPct": 3.0,
     "pi80": {
      "crude": [
       25.73,
       40.38
      ],
      "opIncomeUsdMn": [
       854.2,
       2105.4
      ],
      "ebitdaPct": [
       11.9,
       19.5
      ],
      "pbr": [
       2.55,
       3.27
      ]
     },
     "opIncomeUsdMn": 1479.8,
     "opMarginPct": 7.3,
     "ebitdaPct": 15.7,
     "pbr": 2.91,
     "dps": 2.9909,
     "dpsCcy": "INR",
     "payoutPct": 21.1
    },
    "base": {
     "crude": 32.45,
     "crudeGrowthPct": 3.5,
     "pi80": {
      "crude": [
       25.9,
       40.64
      ],
      "opIncomeUsdMn": [
       1857.9,
       3117.0
      ],
      "ebitdaPct": [
       15.2,
       22.8
      ],
      "pbr": [
       2.56,
       3.28
      ]
     },
     "opIncomeUsdMn": 2487.5,
     "opMarginPct": 12.2,
     "ebitdaPct": 19.0,
     "pbr": 2.92,
     "dps": 5.0276,
     "dpsCcy": "INR",
     "payoutPct": 21.1
    },
    "bull": {
     "crude": 32.65,
     "crudeGrowthPct": 3.9,
     "pi80": {
      "crude": [
       26.07,
       40.91
      ],
      "opIncomeUsdMn": [
       2874.1,
       4141.0
      ],
      "ebitdaPct": [
       18.5,
       26.0
      ],
      "pbr": [
       2.58,
       3.3
      ]
     },
     "opIncomeUsdMn": 3507.6,
     "opMarginPct": 17.0,
     "ebitdaPct": 22.2,
     "pbr": 2.94,
     "dps": 7.0894,
     "dpsCcy": "INR",
     "payoutPct": 21.1
    }
   },
   "2028": {
    "bear": {
     "crude": 33.24,
     "crudeGrowthPct": 3.0,
     "pi80": {
      "crude": [
       25.22,
       43.8
      ],
      "opIncomeUsdMn": [
       880.2,
       2169.6
      ],
      "ebitdaPct": [
       11.9,
       19.5
      ],
      "pbr": [
       2.55,
       3.27
      ]
     },
     "opIncomeUsdMn": 1524.9,
     "opMarginPct": 7.3,
     "ebitdaPct": 15.7,
     "pbr": 2.91,
     "dps": 3.0821,
     "dpsCcy": "INR",
     "payoutPct": 21.1
    },
    "base": {
     "crude": 33.59,
     "crudeGrowthPct": 3.5,
     "pi80": {
      "crude": [
       25.49,
       44.27
      ],
      "opIncomeUsdMn": [
       1922.5,
       3225.4
      ],
      "ebitdaPct": [
       15.2,
       22.8
      ],
      "pbr": [
       2.56,
       3.28
      ]
     },
     "opIncomeUsdMn": 2574.0,
     "opMarginPct": 12.2,
     "ebitdaPct": 19.0,
     "pbr": 2.92,
     "dps": 5.2024,
     "dpsCcy": "INR",
     "payoutPct": 21.1
    },
    "bull": {
     "crude": 33.95,
     "crudeGrowthPct": 3.9,
     "pi80": {
      "crude": [
       25.77,
       44.74
      ],
      "opIncomeUsdMn": [
       2986.4,
       4302.8
      ],
      "ebitdaPct": [
       18.5,
       26.0
      ],
      "pbr": [
       2.58,
       3.3
      ]
     },
     "opIncomeUsdMn": 3644.6,
     "opMarginPct": 17.0,
     "ebitdaPct": 22.2,
     "pbr": 2.94,
     "dps": 7.3663,
     "dpsCcy": "INR",
     "payoutPct": 21.1
    }
   }
  },
  "shougang": {
   "2026": {
    "bear": {
     "crude": 30.62,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       26.11,
       35.91
      ],
      "opIncomeUsdMn": [
       -209.0,
       749.6
      ],
      "ebitdaPct": [
       4.6,
       12.2
      ],
      "pbr": [
       0.28,
       1.0
      ]
     },
     "opIncomeUsdMn": 270.3,
     "opMarginPct": 1.7,
     "ebitdaPct": 8.4,
     "pbr": 0.64,
     "dps": 0.0114,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 30.7,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       26.18,
       36.0
      ],
      "opIncomeUsdMn": [
       171.8,
       1132.7
      ],
      "ebitdaPct": [
       6.3,
       13.9
      ],
      "pbr": [
       0.28,
       1.0
      ]
     },
     "opIncomeUsdMn": 652.2,
     "opMarginPct": 4.2,
     "ebitdaPct": 10.1,
     "pbr": 0.64,
     "dps": 0.0274,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 30.78,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       26.24,
       36.09
      ],
      "opIncomeUsdMn": [
       554.4,
       1517.6
      ],
      "ebitdaPct": [
       8.0,
       15.5
      ],
      "pbr": [
       0.29,
       1.01
      ]
     },
     "opIncomeUsdMn": 1036.0,
     "opMarginPct": 6.6,
     "ebitdaPct": 11.8,
     "pbr": 0.65,
     "dps": 0.0435,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    }
   },
   "2027": {
    "bear": {
     "crude": 30.92,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       24.68,
       38.73
      ],
      "opIncomeUsdMn": [
       -676.3,
       291.3
      ],
      "ebitdaPct": [
       2.6,
       10.1
      ],
      "pbr": [
       0.28,
       1.0
      ]
     },
     "opIncomeUsdMn": -192.5,
     "opMarginPct": -1.2,
     "ebitdaPct": 6.4,
     "pbr": 0.64,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 31.15,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       24.86,
       39.02
      ],
      "opIncomeUsdMn": [
       92.2,
       1066.9
      ],
      "ebitdaPct": [
       5.9,
       13.5
      ],
      "pbr": [
       0.29,
       1.01
      ]
     },
     "opIncomeUsdMn": 579.6,
     "opMarginPct": 3.7,
     "ebitdaPct": 9.7,
     "pbr": 0.65,
     "dps": 0.0244,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 31.38,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       25.05,
       39.31
      ],
      "opIncomeUsdMn": [
       872.0,
       1853.9
      ],
      "ebitdaPct": [
       9.2,
       16.8
      ],
      "pbr": [
       0.3,
       1.01
      ]
     },
     "opIncomeUsdMn": 1362.9,
     "opMarginPct": 8.5,
     "ebitdaPct": 13.0,
     "pbr": 0.65,
     "dps": 0.0573,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    }
   },
   "2028": {
    "bear": {
     "crude": 31.21,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       23.68,
       41.13
      ],
      "opIncomeUsdMn": [
       -682.7,
       294.1
      ],
      "ebitdaPct": [
       2.6,
       10.1
      ],
      "pbr": [
       0.28,
       1.0
      ]
     },
     "opIncomeUsdMn": -194.3,
     "opMarginPct": -1.2,
     "ebitdaPct": 6.4,
     "pbr": 0.64,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 31.6,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       23.98,
       41.64
      ],
      "opIncomeUsdMn": [
       93.5,
       1082.3
      ],
      "ebitdaPct": [
       5.9,
       13.5
      ],
      "pbr": [
       0.29,
       1.01
      ]
     },
     "opIncomeUsdMn": 587.9,
     "opMarginPct": 3.7,
     "ebitdaPct": 9.7,
     "pbr": 0.65,
     "dps": 0.0247,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 31.99,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       24.28,
       42.16
      ],
      "opIncomeUsdMn": [
       888.9,
       1889.7
      ],
      "ebitdaPct": [
       9.2,
       16.8
      ],
      "pbr": [
       0.3,
       1.01
      ]
     },
     "opIncomeUsdMn": 1389.3,
     "opMarginPct": 8.5,
     "ebitdaPct": 13.0,
     "pbr": 0.65,
     "dps": 0.0584,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    }
   }
  },
  "jingye": {
   "2026": {
    "bear": {
     "crude": 24.22,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       20.65,
       28.41
      ]
     }
    },
    "base": {
     "crude": 24.28,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       20.71,
       28.48
      ]
     }
    },
    "bull": {
     "crude": 24.34,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       20.76,
       28.55
      ]
     }
    }
   },
   "2027": {
    "bear": {
     "crude": 24.45,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       19.52,
       30.63
      ]
     }
    },
    "base": {
     "crude": 24.63,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       19.66,
       30.86
      ]
     }
    },
    "bull": {
     "crude": 24.82,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       19.81,
       31.09
      ]
     }
    }
   },
   "2028": {
    "bear": {
     "crude": 24.69,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       18.73,
       32.53
      ]
     }
    },
    "base": {
     "crude": 24.99,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       18.97,
       32.93
      ]
     }
    },
    "bull": {
     "crude": 25.3,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       19.2,
       33.34
      ]
     }
    }
   }
  },
  "jfe": {
   "2026": {
    "bear": {
     "crude": 22.99,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       19.6,
       26.96
      ],
      "opIncomeUsdMn": [
       -354.7,
       1428.8
      ],
      "ebitdaPct": [
       3.1,
       10.6
      ],
      "pbr": [
       0.16,
       0.88
      ]
     },
     "opIncomeUsdMn": 537.1,
     "opMarginPct": 1.9,
     "ebitdaPct": 6.9,
     "pbr": 0.52,
     "dps": 63.8468,
     "dpsCcy": "JPY",
     "payoutPct": 47.1
    },
    "base": {
     "crude": 23.02,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       19.63,
       26.99
      ],
      "opIncomeUsdMn": [
       351.7,
       2137.5
      ],
      "ebitdaPct": [
       4.6,
       12.2
      ],
      "pbr": [
       0.18,
       0.9
      ]
     },
     "opIncomeUsdMn": 1244.6,
     "opMarginPct": 4.3,
     "ebitdaPct": 8.4,
     "pbr": 0.54,
     "dps": 147.9621,
     "dpsCcy": "JPY",
     "payoutPct": 47.1
    },
    "bull": {
     "crude": 23.05,
     "crudeGrowthPct": 1.6,
     "pi80": {
      "crude": [
       19.65,
       27.03
      ],
      "opIncomeUsdMn": [
       1059.9,
       2848.0
      ],
      "ebitdaPct": [
       6.1,
       13.7
      ],
      "pbr": [
       0.19,
       0.91
      ]
     },
     "opIncomeUsdMn": 1953.9,
     "opMarginPct": 6.7,
     "ebitdaPct": 9.9,
     "pbr": 0.55,
     "dps": 200,
     "dpsCcy": "JPY",
     "payoutPct": 47.1
    }
   },
   "2027": {
    "bear": {
     "crude": 23.27,
     "crudeGrowthPct": 1.2,
     "pi80": {
      "crude": [
       18.58,
       29.15
      ],
      "opIncomeUsdMn": [
       -1223.4,
       582.0
      ],
      "ebitdaPct": [
       1.3,
       8.9
      ],
      "pbr": [
       0.13,
       0.85
      ]
     },
     "opIncomeUsdMn": -320.7,
     "opMarginPct": -1.1,
     "ebitdaPct": 5.1,
     "pbr": 0.49,
     "dps": 0.0,
     "dpsCcy": "JPY",
     "payoutPct": 47.1
    },
    "base": {
     "crude": 23.36,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       18.65,
       29.26
      ],
      "opIncomeUsdMn": [
       206.6,
       2018.8
      ],
      "ebitdaPct": [
       4.4,
       11.9
      ],
      "pbr": [
       0.16,
       0.88
      ]
     },
     "opIncomeUsdMn": 1112.7,
     "opMarginPct": 3.8,
     "ebitdaPct": 8.2,
     "pbr": 0.52,
     "dps": 132.2836,
     "dpsCcy": "JPY",
     "payoutPct": 47.1
    },
    "bull": {
     "crude": 23.45,
     "crudeGrowthPct": 1.7,
     "pi80": {
      "crude": [
       18.72,
       29.38
      ],
      "opIncomeUsdMn": [
       1647.5,
       3466.6
      ],
      "ebitdaPct": [
       7.4,
       15.0
      ],
      "pbr": [
       0.2,
       0.92
      ]
     },
     "opIncomeUsdMn": 2557.0,
     "opMarginPct": 8.7,
     "ebitdaPct": 11.2,
     "pbr": 0.56,
     "dps": 200,
     "dpsCcy": "JPY",
     "payoutPct": 47.1
    }
   },
   "2028": {
    "bear": {
     "crude": 23.56,
     "crudeGrowthPct": 1.2,
     "pi80": {
      "crude": [
       17.88,
       31.04
      ],
      "opIncomeUsdMn": [
       -1238.3,
       589.1
      ],
      "ebitdaPct": [
       1.3,
       8.9
      ],
      "pbr": [
       0.13,
       0.85
      ]
     },
     "opIncomeUsdMn": -324.6,
     "opMarginPct": -1.1,
     "ebitdaPct": 5.1,
     "pbr": 0.49,
     "dps": 0.0,
     "dpsCcy": "JPY",
     "payoutPct": 47.1
    },
    "base": {
     "crude": 23.71,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       17.99,
       31.24
      ],
      "opIncomeUsdMn": [
       209.6,
       2048.7
      ],
      "ebitdaPct": [
       4.4,
       11.9
      ],
      "pbr": [
       0.16,
       0.88
      ]
     },
     "opIncomeUsdMn": 1129.2,
     "opMarginPct": 3.8,
     "ebitdaPct": 8.2,
     "pbr": 0.52,
     "dps": 134.2404,
     "dpsCcy": "JPY",
     "payoutPct": 47.1
    },
    "bull": {
     "crude": 23.86,
     "crudeGrowthPct": 1.7,
     "pi80": {
      "crude": [
       18.11,
       31.44
      ],
      "opIncomeUsdMn": [
       1676.1,
       3526.8
      ],
      "ebitdaPct": [
       7.4,
       15.0
      ],
      "pbr": [
       0.2,
       0.92
      ]
     },
     "opIncomeUsdMn": 2601.5,
     "opMarginPct": 8.7,
     "ebitdaPct": 11.2,
     "pbr": 0.56,
     "dps": 200,
     "dpsCcy": "JPY",
     "payoutPct": 47.1
    }
   }
  },
  "hunansteel": {
   "2026": {
    "bear": {
     "crude": 22.89,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       19.52,
       26.85
      ],
      "opIncomeUsdMn": [
       -26.1,
       1107.7
      ],
      "ebitdaPct": [
       2.1,
       9.7
      ],
      "pbr": [
       0.32,
       1.04
      ]
     },
     "opIncomeUsdMn": 540.8,
     "opMarginPct": 2.9,
     "ebitdaPct": 5.9,
     "pbr": 0.68,
     "dps": 0.1217,
     "dpsCcy": "CNY",
     "payoutPct": 61.6
    },
    "base": {
     "crude": 22.95,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       19.57,
       26.92
      ],
      "opIncomeUsdMn": [
       424.8,
       1561.4
      ],
      "ebitdaPct": [
       3.8,
       11.3
      ],
      "pbr": [
       0.33,
       1.05
      ]
     },
     "opIncomeUsdMn": 993.1,
     "opMarginPct": 5.4,
     "ebitdaPct": 7.6,
     "pbr": 0.69,
     "dps": 0.2236,
     "dpsCcy": "CNY",
     "payoutPct": 61.6
    },
    "bull": {
     "crude": 23.01,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       19.62,
       26.98
      ],
      "opIncomeUsdMn": [
       877.9,
       2017.3
      ],
      "ebitdaPct": [
       5.5,
       13.0
      ],
      "pbr": [
       0.33,
       1.05
      ]
     },
     "opIncomeUsdMn": 1447.6,
     "opMarginPct": 7.8,
     "ebitdaPct": 9.2,
     "pbr": 0.69,
     "dps": 0.3259,
     "dpsCcy": "CNY",
     "payoutPct": 61.6
    }
   },
   "2027": {
    "bear": {
     "crude": 23.11,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       18.45,
       28.95
      ],
      "opIncomeUsdMn": [
       -576.8,
       567.8
      ],
      "ebitdaPct": [
       0.0,
       7.6
      ],
      "pbr": [
       0.32,
       1.04
      ]
     },
     "opIncomeUsdMn": -4.5,
     "opMarginPct": -0.0,
     "ebitdaPct": 3.8,
     "pbr": 0.68,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 61.6
    },
    "base": {
     "crude": 23.28,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       18.59,
       29.17
      ],
      "opIncomeUsdMn": [
       333.9,
       1486.9
      ],
      "ebitdaPct": [
       3.4,
       10.9
      ],
      "pbr": [
       0.33,
       1.05
      ]
     },
     "opIncomeUsdMn": 910.4,
     "opMarginPct": 4.9,
     "ebitdaPct": 7.2,
     "pbr": 0.69,
     "dps": 0.2049,
     "dpsCcy": "CNY",
     "payoutPct": 61.6
    },
    "bull": {
     "crude": 23.46,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       18.73,
       29.39
      ],
      "opIncomeUsdMn": [
       1257.9,
       2419.4
      ],
      "ebitdaPct": [
       6.7,
       14.3
      ],
      "pbr": [
       0.34,
       1.06
      ]
     },
     "opIncomeUsdMn": 1838.7,
     "opMarginPct": 9.7,
     "ebitdaPct": 10.5,
     "pbr": 0.7,
     "dps": 0.4139,
     "dpsCcy": "CNY",
     "payoutPct": 61.6
    }
   },
   "2028": {
    "bear": {
     "crude": 23.33,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       17.71,
       30.75
      ],
      "opIncomeUsdMn": [
       -582.3,
       573.1
      ],
      "ebitdaPct": [
       0.0,
       7.6
      ],
      "pbr": [
       0.32,
       1.04
      ]
     },
     "opIncomeUsdMn": -4.6,
     "opMarginPct": -0.0,
     "ebitdaPct": 3.8,
     "pbr": 0.68,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 61.6
    },
    "base": {
     "crude": 23.62,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       17.93,
       31.13
      ],
      "opIncomeUsdMn": [
       338.7,
       1508.3
      ],
      "ebitdaPct": [
       3.4,
       10.9
      ],
      "pbr": [
       0.33,
       1.05
      ]
     },
     "opIncomeUsdMn": 923.5,
     "opMarginPct": 4.9,
     "ebitdaPct": 7.2,
     "pbr": 0.69,
     "dps": 0.2079,
     "dpsCcy": "CNY",
     "payoutPct": 61.6
    },
    "bull": {
     "crude": 23.92,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       18.15,
       31.52
      ],
      "opIncomeUsdMn": [
       1282.3,
       2466.2
      ],
      "ebitdaPct": [
       6.7,
       14.3
      ],
      "pbr": [
       0.34,
       1.06
      ]
     },
     "opIncomeUsdMn": 1874.2,
     "opMarginPct": 9.7,
     "ebitdaPct": 10.5,
     "pbr": 0.7,
     "dps": 0.4219,
     "dpsCcy": "CNY",
     "payoutPct": 61.6
    }
   }
  },
  "nucor": {
   "2026": {
    "bear": {
     "crude": 22.74,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       19.39,
       26.67
      ],
      "opIncomeUsdMn": [
       2658.1,
       4694.7
      ],
      "ebitdaPct": [
       12.0,
       19.5
      ],
      "pbr": [
       1.39,
       2.11
      ]
     },
     "opIncomeUsdMn": 3676.4,
     "opMarginPct": 11.1,
     "ebitdaPct": 15.8,
     "pbr": 1.75,
     "dps": 1.9651,
     "dpsCcy": "USD",
     "payoutPct": 22.3
    },
    "base": {
     "crude": 22.76,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       19.41,
       26.69
      ],
      "opIncomeUsdMn": [
       3465.4,
       5503.3
      ],
      "ebitdaPct": [
       13.4,
       21.0
      ],
      "pbr": [
       1.41,
       2.13
      ]
     },
     "opIncomeUsdMn": 4484.3,
     "opMarginPct": 13.5,
     "ebitdaPct": 17.2,
     "pbr": 1.77,
     "dps": 2.3969,
     "dpsCcy": "USD",
     "payoutPct": 22.3
    },
    "bull": {
     "crude": 22.77,
     "crudeGrowthPct": 2.0,
     "pi80": {
      "crude": [
       19.42,
       26.71
      ],
      "opIncomeUsdMn": [
       4273.7,
       6312.9
      ],
      "ebitdaPct": [
       14.9,
       22.4
      ],
      "pbr": [
       1.44,
       2.16
      ]
     },
     "opIncomeUsdMn": 5293.3,
     "opMarginPct": 16.0,
     "ebitdaPct": 18.7,
     "pbr": 1.8,
     "dps": 2.8293,
     "dpsCcy": "USD",
     "payoutPct": 22.3
    }
   },
   "2027": {
    "bear": {
     "crude": 23.14,
     "crudeGrowthPct": 1.7,
     "pi80": {
      "crude": [
       18.47,
       28.99
      ],
      "opIncomeUsdMn": [
       1711.4,
       3782.9
      ],
      "ebitdaPct": [
       10.2,
       17.7
      ],
      "pbr": [
       1.36,
       2.08
      ]
     },
     "opIncomeUsdMn": 2747.1,
     "opMarginPct": 8.2,
     "ebitdaPct": 13.9,
     "pbr": 1.72,
     "dps": 1.4684,
     "dpsCcy": "USD",
     "payoutPct": 22.3
    },
    "base": {
     "crude": 23.18,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       18.51,
       29.04
      ],
      "opIncomeUsdMn": [
       3355.6,
       5431.2
      ],
      "ebitdaPct": [
       13.1,
       20.6
      ],
      "pbr": [
       1.41,
       2.13
      ]
     },
     "opIncomeUsdMn": 4393.4,
     "opMarginPct": 13.0,
     "ebitdaPct": 16.9,
     "pbr": 1.77,
     "dps": 2.3483,
     "dpsCcy": "USD",
     "payoutPct": 22.3
    },
    "bull": {
     "crude": 23.23,
     "crudeGrowthPct": 2.0,
     "pi80": {
      "crude": [
       18.54,
       29.1
      ],
      "opIncomeUsdMn": [
       5006.2,
       7085.7
      ],
      "ebitdaPct": [
       16.0,
       23.5
      ],
      "pbr": [
       1.46,
       2.18
      ]
     },
     "opIncomeUsdMn": 6046.0,
     "opMarginPct": 17.9,
     "ebitdaPct": 19.8,
     "pbr": 1.82,
     "dps": 3.2316,
     "dpsCcy": "USD",
     "payoutPct": 22.3
    }
   },
   "2028": {
    "bear": {
     "crude": 23.54,
     "crudeGrowthPct": 1.7,
     "pi80": {
      "crude": [
       17.86,
       31.02
      ],
      "opIncomeUsdMn": [
       1740.8,
       3847.9
      ],
      "ebitdaPct": [
       10.2,
       17.7
      ],
      "pbr": [
       1.36,
       2.08
      ]
     },
     "opIncomeUsdMn": 2794.3,
     "opMarginPct": 8.2,
     "ebitdaPct": 13.9,
     "pbr": 1.72,
     "dps": 1.4936,
     "dpsCcy": "USD",
     "payoutPct": 22.3
    },
    "base": {
     "crude": 23.62,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       17.92,
       31.12
      ],
      "opIncomeUsdMn": [
       3417.7,
       5531.6
      ],
      "ebitdaPct": [
       13.1,
       20.6
      ],
      "pbr": [
       1.41,
       2.13
      ]
     },
     "opIncomeUsdMn": 4474.6,
     "opMarginPct": 13.0,
     "ebitdaPct": 16.9,
     "pbr": 1.77,
     "dps": 2.3917,
     "dpsCcy": "USD",
     "payoutPct": 22.3
    },
    "bull": {
     "crude": 23.69,
     "crudeGrowthPct": 2.0,
     "pi80": {
      "crude": [
       17.98,
       31.22
      ],
      "opIncomeUsdMn": [
       5105.3,
       7226.0
      ],
      "ebitdaPct": [
       16.0,
       23.5
      ],
      "pbr": [
       1.46,
       2.18
      ]
     },
     "opIncomeUsdMn": 6165.7,
     "opMarginPct": 17.9,
     "ebitdaPct": 19.8,
     "pbr": 1.82,
     "dps": 3.2956,
     "dpsCcy": "USD",
     "payoutPct": 22.3
    }
   }
  },
  "liuzhou": {
   "2026": {
    "bear": {
     "crude": 21.27,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       18.14,
       24.95
      ],
      "opIncomeUsdMn": [
       -282.4,
       359.3
      ],
      "ebitdaPct": [
       0.3,
       7.9
      ],
      "pbr": [
       0.75,
       1.47
      ]
     },
     "opIncomeUsdMn": 38.4,
     "opMarginPct": 0.4,
     "ebitdaPct": 4.1,
     "pbr": 1.11,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 21.33,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       18.19,
       25.01
      ],
      "opIncomeUsdMn": [
       -27.9,
       615.3
      ],
      "ebitdaPct": [
       2.0,
       9.6
      ],
      "pbr": [
       0.75,
       1.47
      ]
     },
     "opIncomeUsdMn": 293.7,
     "opMarginPct": 2.8,
     "ebitdaPct": 5.8,
     "pbr": 1.11,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 21.38,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       18.23,
       25.07
      ],
      "opIncomeUsdMn": [
       227.9,
       872.7
      ],
      "ebitdaPct": [
       3.7,
       11.2
      ],
      "pbr": [
       0.76,
       1.48
      ]
     },
     "opIncomeUsdMn": 550.3,
     "opMarginPct": 5.3,
     "ebitdaPct": 7.5,
     "pbr": 1.12,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    }
   },
   "2027": {
    "bear": {
     "crude": 21.48,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       17.14,
       26.9
      ],
      "opIncomeUsdMn": [
       -596.5,
       51.2
      ],
      "ebitdaPct": [
       -1.7,
       5.8
      ],
      "pbr": [
       0.75,
       1.47
      ]
     },
     "opIncomeUsdMn": -272.7,
     "opMarginPct": -2.6,
     "ebitdaPct": 2.1,
     "pbr": 1.11,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 21.64,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       17.27,
       27.1
      ],
      "opIncomeUsdMn": [
       -83.2,
       569.3
      ],
      "ebitdaPct": [
       1.6,
       9.2
      ],
      "pbr": [
       0.76,
       1.48
      ]
     },
     "opIncomeUsdMn": 243.1,
     "opMarginPct": 2.3,
     "ebitdaPct": 5.4,
     "pbr": 1.12,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 21.8,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       17.4,
       27.31
      ],
      "opIncomeUsdMn": [
       437.8,
       1095.0
      ],
      "ebitdaPct": [
       4.9,
       12.5
      ],
      "pbr": [
       0.77,
       1.48
      ]
     },
     "opIncomeUsdMn": 766.4,
     "opMarginPct": 7.2,
     "ebitdaPct": 8.7,
     "pbr": 1.12,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    }
   },
   "2028": {
    "bear": {
     "crude": 21.68,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       16.45,
       28.57
      ],
      "opIncomeUsdMn": [
       -602.2,
       51.7
      ],
      "ebitdaPct": [
       -1.7,
       5.8
      ],
      "pbr": [
       0.75,
       1.47
      ]
     },
     "opIncomeUsdMn": -275.3,
     "opMarginPct": -2.6,
     "ebitdaPct": 2.1,
     "pbr": 1.11,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 21.95,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       16.66,
       28.93
      ],
      "opIncomeUsdMn": [
       -84.4,
       577.5
      ],
      "ebitdaPct": [
       1.6,
       9.2
      ],
      "pbr": [
       0.76,
       1.48
      ]
     },
     "opIncomeUsdMn": 246.6,
     "opMarginPct": 2.3,
     "ebitdaPct": 5.4,
     "pbr": 1.12,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 22.22,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       16.86,
       29.28
      ],
      "opIncomeUsdMn": [
       446.2,
       1116.2
      ],
      "ebitdaPct": [
       4.9,
       12.5
      ],
      "pbr": [
       0.77,
       1.48
      ]
     },
     "opIncomeUsdMn": 781.2,
     "opMarginPct": 7.2,
     "ebitdaPct": 8.7,
     "pbr": 1.12,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    }
   }
  },
  "sail": {
   "2026": {
    "bear": {
     "crude": 20.08,
     "crudeGrowthPct": 3.2,
     "pi80": {
      "crude": [
       17.12,
       23.54
      ],
      "opIncomeUsdMn": [
       228.7,
       962.4
      ],
      "ebitdaPct": [
       6.5,
       14.0
      ],
      "pbr": [
       0.64,
       1.36
      ]
     },
     "opIncomeUsdMn": 595.5,
     "opMarginPct": 5.0,
     "ebitdaPct": 10.3,
     "pbr": 1.0,
     "dps": 1.251,
     "dpsCcy": "INR",
     "payoutPct": 19.1
    },
    "base": {
     "crude": 20.12,
     "crudeGrowthPct": 3.4,
     "pi80": {
      "crude": [
       17.16,
       23.59
      ],
      "opIncomeUsdMn": [
       520.7,
       1255.9
      ],
      "ebitdaPct": [
       8.1,
       15.7
      ],
      "pbr": [
       0.65,
       1.37
      ]
     },
     "opIncomeUsdMn": 888.3,
     "opMarginPct": 7.4,
     "ebitdaPct": 11.9,
     "pbr": 1.01,
     "dps": 1.8659,
     "dpsCcy": "INR",
     "payoutPct": 19.1
    },
    "bull": {
     "crude": 20.16,
     "crudeGrowthPct": 3.6,
     "pi80": {
      "crude": [
       17.19,
       23.64
      ],
      "opIncomeUsdMn": [
       813.9,
       1550.6
      ],
      "ebitdaPct": [
       9.7,
       17.3
      ],
      "pbr": [
       0.66,
       1.38
      ]
     },
     "opIncomeUsdMn": 1182.2,
     "opMarginPct": 9.9,
     "ebitdaPct": 13.5,
     "pbr": 1.02,
     "dps": 2.4834,
     "dpsCcy": "INR",
     "payoutPct": 19.1
    }
   },
   "2027": {
    "bear": {
     "crude": 20.7,
     "crudeGrowthPct": 3.0,
     "pi80": {
      "crude": [
       16.52,
       25.93
      ],
      "opIncomeUsdMn": [
       -126.8,
       629.2
      ],
      "ebitdaPct": [
       4.6,
       12.2
      ],
      "pbr": [
       0.62,
       1.34
      ]
     },
     "opIncomeUsdMn": 251.2,
     "opMarginPct": 2.0,
     "ebitdaPct": 8.4,
     "pbr": 0.98,
     "dps": 0.5277,
     "dpsCcy": "INR",
     "payoutPct": 19.1
    },
    "base": {
     "crude": 20.83,
     "crudeGrowthPct": 3.5,
     "pi80": {
      "crude": [
       16.63,
       26.09
      ],
      "opIncomeUsdMn": [
       475.7,
       1236.4
      ],
      "ebitdaPct": [
       7.9,
       15.4
      ],
      "pbr": [
       0.64,
       1.36
      ]
     },
     "opIncomeUsdMn": 856.1,
     "opMarginPct": 6.9,
     "ebitdaPct": 11.6,
     "pbr": 1.0,
     "dps": 1.7982,
     "dpsCcy": "INR",
     "payoutPct": 19.1
    },
    "bull": {
     "crude": 20.96,
     "crudeGrowthPct": 3.9,
     "pi80": {
      "crude": [
       16.74,
       26.26
      ],
      "opIncomeUsdMn": [
       1085.7,
       1851.1
      ],
      "ebitdaPct": [
       11.1,
       18.7
      ],
      "pbr": [
       0.65,
       1.37
      ]
     },
     "opIncomeUsdMn": 1468.4,
     "opMarginPct": 11.8,
     "ebitdaPct": 14.9,
     "pbr": 1.01,
     "dps": 3.0845,
     "dpsCcy": "INR",
     "payoutPct": 19.1
    }
   },
   "2028": {
    "bear": {
     "crude": 21.34,
     "crudeGrowthPct": 3.0,
     "pi80": {
      "crude": [
       16.19,
       28.12
      ],
      "opIncomeUsdMn": [
       -130.6,
       648.4
      ],
      "ebitdaPct": [
       4.6,
       12.2
      ],
      "pbr": [
       0.62,
       1.34
      ]
     },
     "opIncomeUsdMn": 258.9,
     "opMarginPct": 2.0,
     "ebitdaPct": 8.4,
     "pbr": 0.98,
     "dps": 0.5438,
     "dpsCcy": "INR",
     "payoutPct": 19.1
    },
    "base": {
     "crude": 21.57,
     "crudeGrowthPct": 3.5,
     "pi80": {
      "crude": [
       16.37,
       28.42
      ],
      "opIncomeUsdMn": [
       492.2,
       1279.4
      ],
      "ebitdaPct": [
       7.9,
       15.4
      ],
      "pbr": [
       0.64,
       1.36
      ]
     },
     "opIncomeUsdMn": 885.8,
     "opMarginPct": 6.9,
     "ebitdaPct": 11.6,
     "pbr": 1.0,
     "dps": 1.8608,
     "dpsCcy": "INR",
     "payoutPct": 19.1
    },
    "bull": {
     "crude": 21.8,
     "crudeGrowthPct": 3.9,
     "pi80": {
      "crude": [
       16.54,
       28.73
      ],
      "opIncomeUsdMn": [
       1128.1,
       1923.4
      ],
      "ebitdaPct": [
       11.1,
       18.7
      ],
      "pbr": [
       0.65,
       1.37
      ]
     },
     "opIncomeUsdMn": 1525.7,
     "opMarginPct": 11.8,
     "ebitdaPct": 14.9,
     "pbr": 1.01,
     "dps": 3.2,
     "dpsCcy": "INR",
     "payoutPct": 19.1
    }
   }
  },
  "shandong": {
   "2026": {
    "bear": {
     "crude": 18.5,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       15.77,
       21.69
      ],
      "opIncomeUsdMn": [
       -411.4,
       215.0
      ],
      "ebitdaPct": [
       -1.4,
       6.2
      ],
      "pbr": [
       0.46,
       1.18
      ]
     },
     "opIncomeUsdMn": -98.2,
     "opMarginPct": -1.0,
     "ebitdaPct": 2.4,
     "pbr": 0.82,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 18.54,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       15.81,
       21.75
      ],
      "opIncomeUsdMn": [
       -163.2,
       464.7
      ],
      "ebitdaPct": [
       0.3,
       7.9
      ],
      "pbr": [
       0.47,
       1.19
      ]
     },
     "opIncomeUsdMn": 150.7,
     "opMarginPct": 1.5,
     "ebitdaPct": 4.1,
     "pbr": 0.83,
     "dps": 0.003,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 18.59,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       15.85,
       21.8
      ],
      "opIncomeUsdMn": [
       86.1,
       715.5
      ],
      "ebitdaPct": [
       2.0,
       9.5
      ],
      "pbr": [
       0.47,
       1.19
      ]
     },
     "opIncomeUsdMn": 400.8,
     "opMarginPct": 3.9,
     "ebitdaPct": 5.8,
     "pbr": 0.83,
     "dps": 0.008,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    }
   },
   "2027": {
    "bear": {
     "crude": 18.67,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       14.91,
       23.39
      ],
      "opIncomeUsdMn": [
       -719.3,
       -87.0
      ],
      "ebitdaPct": [
       -3.4,
       4.1
      ],
      "pbr": [
       0.46,
       1.18
      ]
     },
     "opIncomeUsdMn": -403.2,
     "opMarginPct": -3.9,
     "ebitdaPct": 0.4,
     "pbr": 0.82,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 18.81,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       15.02,
       23.57
      ],
      "opIncomeUsdMn": [
       -219.2,
       417.8
      ],
      "ebitdaPct": [
       -0.1,
       7.5
      ],
      "pbr": [
       0.47,
       1.19
      ]
     },
     "opIncomeUsdMn": 99.3,
     "opMarginPct": 1.0,
     "ebitdaPct": 3.7,
     "pbr": 0.83,
     "dps": 0.002,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 18.95,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       15.13,
       23.74
      ],
      "opIncomeUsdMn": [
       288.3,
       930.0
      ],
      "ebitdaPct": [
       3.2,
       10.8
      ],
      "pbr": [
       0.48,
       1.2
      ]
     },
     "opIncomeUsdMn": 609.1,
     "opMarginPct": 5.8,
     "ebitdaPct": 7.0,
     "pbr": 0.84,
     "dps": 0.0122,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    }
   },
   "2028": {
    "bear": {
     "crude": 18.85,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       14.31,
       24.84
      ],
      "opIncomeUsdMn": [
       -726.2,
       -87.9
      ],
      "ebitdaPct": [
       -3.4,
       4.1
      ],
      "pbr": [
       0.46,
       1.18
      ]
     },
     "opIncomeUsdMn": -407.0,
     "opMarginPct": -3.9,
     "ebitdaPct": 0.4,
     "pbr": 0.82,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 19.09,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       14.48,
       25.15
      ],
      "opIncomeUsdMn": [
       -222.3,
       423.8
      ],
      "ebitdaPct": [
       -0.1,
       7.5
      ],
      "pbr": [
       0.47,
       1.19
      ]
     },
     "opIncomeUsdMn": 100.7,
     "opMarginPct": 1.0,
     "ebitdaPct": 3.7,
     "pbr": 0.83,
     "dps": 0.002,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 19.32,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       14.66,
       25.46
      ],
      "opIncomeUsdMn": [
       293.9,
       947.9
      ],
      "ebitdaPct": [
       3.2,
       10.8
      ],
      "pbr": [
       0.48,
       1.2
      ]
     },
     "opIncomeUsdMn": 620.9,
     "opMarginPct": 5.8,
     "ebitdaPct": 7.0,
     "pbr": 0.84,
     "dps": 0.0125,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    }
   }
  },
  "hyundaisteel": {
   "2026": {
    "bear": {
     "crude": 18.31,
     "crudeGrowthPct": 2.0,
     "pi80": {
      "crude": [
       15.62,
       21.48
      ],
      "opIncomeUsdMn": [
       -392.2,
       669.8
      ],
      "ebitdaPct": [
       5.4,
       13.0
      ],
      "pbr": [
       0.05,
       0.52
      ]
     },
     "opIncomeUsdMn": 138.8,
     "opMarginPct": 0.8,
     "ebitdaPct": 9.2,
     "pbr": 0.16,
     "dps": 142.0208,
     "dpsCcy": "KRW",
     "payoutPct": 28.7
    },
    "base": {
     "crude": 18.34,
     "crudeGrowthPct": 2.1,
     "pi80": {
      "crude": [
       15.64,
       21.51
      ],
      "opIncomeUsdMn": [
       28.3,
       1091.6
      ],
      "ebitdaPct": [
       7.0,
       14.5
      ],
      "pbr": [
       0.05,
       0.54
      ]
     },
     "opIncomeUsdMn": 559.9,
     "opMarginPct": 3.2,
     "ebitdaPct": 10.8,
     "pbr": 0.18,
     "dps": 572.9006,
     "dpsCcy": "KRW",
     "payoutPct": 28.7
    },
    "bull": {
     "crude": 18.36,
     "crudeGrowthPct": 2.3,
     "pi80": {
      "crude": [
       15.66,
       21.54
      ],
      "opIncomeUsdMn": [
       449.8,
       1514.6
      ],
      "ebitdaPct": [
       8.5,
       16.1
      ],
      "pbr": [
       0.05,
       0.55
      ]
     },
     "opIncomeUsdMn": 982.2,
     "opMarginPct": 5.7,
     "ebitdaPct": 12.3,
     "pbr": 0.19,
     "dps": 1004.9252,
     "dpsCcy": "KRW",
     "payoutPct": 28.7
    }
   },
   "2027": {
    "bear": {
     "crude": 18.61,
     "crudeGrowthPct": 1.6,
     "pi80": {
      "crude": [
       14.86,
       23.32
      ],
      "opIncomeUsdMn": [
       -917.9,
       161.4
      ],
      "ebitdaPct": [
       3.3,
       10.9
      ],
      "pbr": [
       0.05,
       0.53
      ]
     },
     "opIncomeUsdMn": -378.2,
     "opMarginPct": -2.2,
     "ebitdaPct": 7.1,
     "pbr": 0.17,
     "dps": 0.0,
     "dpsCcy": "KRW",
     "payoutPct": 28.7
    },
    "base": {
     "crude": 18.69,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       14.92,
       23.41
      ],
      "opIncomeUsdMn": [
       -63.6,
       1019.9
      ],
      "ebitdaPct": [
       6.4,
       14.0
      ],
      "pbr": [
       0.05,
       0.56
      ]
     },
     "opIncomeUsdMn": 478.1,
     "opMarginPct": 2.7,
     "ebitdaPct": 10.2,
     "pbr": 0.2,
     "dps": 489.2052,
     "dpsCcy": "KRW",
     "payoutPct": 28.7
    },
    "bull": {
     "crude": 18.77,
     "crudeGrowthPct": 2.2,
     "pi80": {
      "crude": [
       14.98,
       23.51
      ],
      "opIncomeUsdMn": [
       797.4,
       1885.3
      ],
      "ebitdaPct": [
       9.5,
       17.0
      ],
      "pbr": [
       0.05,
       0.59
      ]
     },
     "opIncomeUsdMn": 1341.4,
     "opMarginPct": 7.6,
     "ebitdaPct": 13.2,
     "pbr": 0.23,
     "dps": 1372.413,
     "dpsCcy": "KRW",
     "payoutPct": 28.7
    }
   },
   "2028": {
    "bear": {
     "crude": 18.92,
     "crudeGrowthPct": 1.6,
     "pi80": {
      "crude": [
       14.36,
       24.93
      ],
      "opIncomeUsdMn": [
       -932.8,
       164.0
      ],
      "ebitdaPct": [
       3.3,
       10.9
      ],
      "pbr": [
       0.05,
       0.53
      ]
     },
     "opIncomeUsdMn": -384.4,
     "opMarginPct": -2.2,
     "ebitdaPct": 7.1,
     "pbr": 0.17,
     "dps": 0.0,
     "dpsCcy": "KRW",
     "payoutPct": 28.7
    },
    "base": {
     "crude": 19.05,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       14.46,
       25.1
      ],
      "opIncomeUsdMn": [
       -64.8,
       1039.3
      ],
      "ebitdaPct": [
       6.4,
       14.0
      ],
      "pbr": [
       0.05,
       0.56
      ]
     },
     "opIncomeUsdMn": 487.2,
     "opMarginPct": 2.7,
     "ebitdaPct": 10.2,
     "pbr": 0.2,
     "dps": 498.498,
     "dpsCcy": "KRW",
     "payoutPct": 28.7
    },
    "bull": {
     "crude": 19.18,
     "crudeGrowthPct": 2.2,
     "pi80": {
      "crude": [
       14.55,
       25.27
      ],
      "opIncomeUsdMn": [
       814.8,
       1926.3
      ],
      "ebitdaPct": [
       9.5,
       17.0
      ],
      "pbr": [
       0.05,
       0.59
      ]
     },
     "opIncomeUsdMn": 1370.5,
     "opMarginPct": 7.6,
     "ebitdaPct": 13.2,
     "pbr": 0.23,
     "dps": 1402.2092,
     "dpsCcy": "KRW",
     "payoutPct": 28.7
    }
   }
  },
  "fangda": {
   "2026": {
    "bear": {
     "crude": 18.13,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       15.46,
       21.27
      ],
      "opIncomeUsdMn": [
       -2.1,
       167.7
      ],
      "ebitdaPct": [
       2.0,
       9.5
      ],
      "pbr": [
       0.86,
       1.58
      ]
     },
     "opIncomeUsdMn": 82.8,
     "opMarginPct": 3.0,
     "ebitdaPct": 5.8,
     "pbr": 1.22,
     "dps": 0.0285,
     "dpsCcy": "CNY",
     "payoutPct": 45.5
    },
    "base": {
     "crude": 18.18,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       15.5,
       21.32
      ],
      "opIncomeUsdMn": [
       65.5,
       235.7
      ],
      "ebitdaPct": [
       3.7,
       11.2
      ],
      "pbr": [
       0.86,
       1.58
      ]
     },
     "opIncomeUsdMn": 150.6,
     "opMarginPct": 5.4,
     "ebitdaPct": 7.4,
     "pbr": 1.22,
     "dps": 0.0518,
     "dpsCcy": "CNY",
     "payoutPct": 45.5
    },
    "bull": {
     "crude": 18.22,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       15.54,
       21.37
      ],
      "opIncomeUsdMn": [
       133.3,
       304.0
      ],
      "ebitdaPct": [
       5.3,
       12.9
      ],
      "pbr": [
       0.87,
       1.59
      ]
     },
     "opIncomeUsdMn": 218.7,
     "opMarginPct": 7.9,
     "ebitdaPct": 9.1,
     "pbr": 1.23,
     "dps": 0.0752,
     "dpsCcy": "CNY",
     "payoutPct": 45.5
    }
   },
   "2027": {
    "bear": {
     "crude": 18.31,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       14.61,
       22.93
      ],
      "opIncomeUsdMn": [
       -84.5,
       86.9
      ],
      "ebitdaPct": [
       -0.1,
       7.5
      ],
      "pbr": [
       0.86,
       1.58
      ]
     },
     "opIncomeUsdMn": 1.2,
     "opMarginPct": 0.0,
     "ebitdaPct": 3.7,
     "pbr": 1.22,
     "dps": 0.0004,
     "dpsCcy": "CNY",
     "payoutPct": 45.5
    },
    "base": {
     "crude": 18.44,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       14.72,
       23.1
      ],
      "opIncomeUsdMn": [
       51.9,
       224.6
      ],
      "ebitdaPct": [
       3.2,
       10.8
      ],
      "pbr": [
       0.87,
       1.59
      ]
     },
     "opIncomeUsdMn": 138.2,
     "opMarginPct": 4.9,
     "ebitdaPct": 7.0,
     "pbr": 1.23,
     "dps": 0.0475,
     "dpsCcy": "CNY",
     "payoutPct": 45.5
    },
    "bull": {
     "crude": 18.58,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       14.83,
       23.27
      ],
      "opIncomeUsdMn": [
       190.3,
       364.2
      ],
      "ebitdaPct": [
       6.6,
       14.1
      ],
      "pbr": [
       0.88,
       1.59
      ]
     },
     "opIncomeUsdMn": 277.3,
     "opMarginPct": 9.8,
     "ebitdaPct": 10.4,
     "pbr": 1.23,
     "dps": 0.0953,
     "dpsCcy": "CNY",
     "payoutPct": 45.5
    }
   },
   "2028": {
    "bear": {
     "crude": 18.48,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       14.02,
       24.35
      ],
      "opIncomeUsdMn": [
       -85.3,
       87.7
      ],
      "ebitdaPct": [
       -0.1,
       7.5
      ],
      "pbr": [
       0.86,
       1.58
      ]
     },
     "opIncomeUsdMn": 1.2,
     "opMarginPct": 0.0,
     "ebitdaPct": 3.7,
     "pbr": 1.22,
     "dps": 0.0004,
     "dpsCcy": "CNY",
     "payoutPct": 45.5
    },
    "base": {
     "crude": 18.71,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       14.2,
       24.66
      ],
      "opIncomeUsdMn": [
       52.6,
       227.8
      ],
      "ebitdaPct": [
       3.2,
       10.8
      ],
      "pbr": [
       0.87,
       1.59
      ]
     },
     "opIncomeUsdMn": 140.2,
     "opMarginPct": 4.9,
     "ebitdaPct": 7.0,
     "pbr": 1.23,
     "dps": 0.0482,
     "dpsCcy": "CNY",
     "payoutPct": 45.5
    },
    "bull": {
     "crude": 18.94,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       14.37,
       24.96
      ],
      "opIncomeUsdMn": [
       194.0,
       371.3
      ],
      "ebitdaPct": [
       6.6,
       14.1
      ],
      "pbr": [
       0.88,
       1.59
      ]
     },
     "opIncomeUsdMn": 282.6,
     "opMarginPct": 9.8,
     "ebitdaPct": 10.4,
     "pbr": 1.23,
     "dps": 0.0972,
     "dpsCcy": "CNY",
     "payoutPct": 45.5
    }
   }
  },
  "clevelandcliffs": {
   "2026": {
    "bear": {
     "crude": 17.37,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       14.81,
       20.37
      ],
      "opIncomeUsdMn": [
       -1175.1,
       -8.7
      ],
      "ebitdaPct": [
       -1.5,
       6.1
      ],
      "pbr": [
       0.75,
       1.47
      ]
     },
     "opIncomeUsdMn": -591.9,
     "opMarginPct": -3.1,
     "ebitdaPct": 2.3,
     "pbr": 1.11,
     "dps": 0.0,
     "dpsCcy": "USD"
    },
    "base": {
     "crude": 17.38,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       14.82,
       20.38
      ],
      "opIncomeUsdMn": [
       -714.5,
       452.6
      ],
      "ebitdaPct": [
       -0.0,
       7.6
      ],
      "pbr": [
       0.78,
       1.5
      ]
     },
     "opIncomeUsdMn": -130.9,
     "opMarginPct": -0.7,
     "ebitdaPct": 3.8,
     "pbr": 1.14,
     "dps": 0.0,
     "dpsCcy": "USD"
    },
    "bull": {
     "crude": 17.39,
     "crudeGrowthPct": 2.0,
     "pi80": {
      "crude": [
       14.83,
       20.39
      ],
      "opIncomeUsdMn": [
       -253.3,
       914.6
      ],
      "ebitdaPct": [
       1.4,
       9.0
      ],
      "pbr": [
       0.8,
       1.52
      ]
     },
     "opIncomeUsdMn": 330.6,
     "opMarginPct": 1.7,
     "ebitdaPct": 5.2,
     "pbr": 1.16,
     "dps": 0.0,
     "dpsCcy": "USD"
    }
   },
   "2027": {
    "bear": {
     "crude": 17.67,
     "crudeGrowthPct": 1.7,
     "pi80": {
      "crude": [
       14.1,
       22.13
      ],
      "opIncomeUsdMn": [
       -1763.7,
       -577.3
      ],
      "ebitdaPct": [
       -3.3,
       4.3
      ],
      "pbr": [
       0.72,
       1.44
      ]
     },
     "opIncomeUsdMn": -1170.5,
     "opMarginPct": -6.1,
     "ebitdaPct": 0.5,
     "pbr": 1.08,
     "dps": 0.0,
     "dpsCcy": "USD"
    },
    "base": {
     "crude": 17.7,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       14.13,
       22.18
      ],
      "opIncomeUsdMn": [
       -827.3,
       361.4
      ],
      "ebitdaPct": [
       -0.4,
       7.2
      ],
      "pbr": [
       0.78,
       1.49
      ]
     },
     "opIncomeUsdMn": -232.9,
     "opMarginPct": -1.2,
     "ebitdaPct": 3.4,
     "pbr": 1.13,
     "dps": 0.0,
     "dpsCcy": "USD"
    },
    "bull": {
     "crude": 17.74,
     "crudeGrowthPct": 2.0,
     "pi80": {
      "crude": [
       14.16,
       22.22
      ],
      "opIncomeUsdMn": [
       112.7,
       1303.7
      ],
      "ebitdaPct": [
       2.5,
       10.1
      ],
      "pbr": [
       0.83,
       1.55
      ]
     },
     "opIncomeUsdMn": 708.2,
     "opMarginPct": 3.7,
     "ebitdaPct": 6.3,
     "pbr": 1.19,
     "dps": 0.0,
     "dpsCcy": "USD"
    }
   },
   "2028": {
    "bear": {
     "crude": 17.97,
     "crudeGrowthPct": 1.7,
     "pi80": {
      "crude": [
       13.64,
       23.68
      ],
      "opIncomeUsdMn": [
       -1794.0,
       -587.2
      ],
      "ebitdaPct": [
       -3.3,
       4.3
      ],
      "pbr": [
       0.72,
       1.44
      ]
     },
     "opIncomeUsdMn": -1190.6,
     "opMarginPct": -6.1,
     "ebitdaPct": 0.5,
     "pbr": 1.08,
     "dps": 0.0,
     "dpsCcy": "USD"
    },
    "base": {
     "crude": 18.03,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       13.68,
       23.76
      ],
      "opIncomeUsdMn": [
       -842.6,
       368.1
      ],
      "ebitdaPct": [
       -0.4,
       7.2
      ],
      "pbr": [
       0.78,
       1.49
      ]
     },
     "opIncomeUsdMn": -237.2,
     "opMarginPct": -1.2,
     "ebitdaPct": 3.4,
     "pbr": 1.13,
     "dps": 0.0,
     "dpsCcy": "USD"
    },
    "bull": {
     "crude": 18.09,
     "crudeGrowthPct": 2.0,
     "pi80": {
      "crude": [
       13.73,
       23.84
      ],
      "opIncomeUsdMn": [
       115.0,
       1329.5
      ],
      "ebitdaPct": [
       2.5,
       10.1
      ],
      "pbr": [
       0.83,
       1.55
      ]
     },
     "opIncomeUsdMn": 722.2,
     "opMarginPct": 3.7,
     "ebitdaPct": 6.3,
     "pbr": 1.19,
     "dps": 0.0,
     "dpsCcy": "USD"
    }
   }
  },
  "rizhao": {
   "2026": {
    "bear": {
     "crude": 17.26,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       14.72,
       20.24
      ]
     }
    },
    "base": {
     "crude": 17.3,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       14.76,
       20.29
      ]
     }
    },
    "bull": {
     "crude": 17.35,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       14.79,
       20.34
      ]
     }
    }
   },
   "2027": {
    "bear": {
     "crude": 17.43,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       13.91,
       21.83
      ]
     }
    },
    "base": {
     "crude": 17.56,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       14.01,
       21.99
      ]
     }
    },
    "bull": {
     "crude": 17.69,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       14.12,
       22.16
      ]
     }
    }
   },
   "2028": {
    "bear": {
     "crude": 17.59,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       13.35,
       23.18
      ]
     }
    },
    "base": {
     "crude": 17.81,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       13.52,
       23.47
      ]
     }
    },
    "bull": {
     "crude": 18.03,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       13.68,
       23.76
      ]
     }
    }
   }
  },
  "techint": {
   "2026": {
    "bear": {
     "crude": 16.57,
     "crudeGrowthPct": 1.6,
     "pi80": {
      "crude": [
       14.13,
       19.43
      ],
      "opIncomeUsdMn": [
       655.2,
       1631.7
      ],
      "ebitdaPct": [
       6.7,
       14.3
      ],
      "pbr": [
       0.19,
       0.9
      ]
     },
     "opIncomeUsdMn": 1143.4,
     "opMarginPct": 7.2,
     "ebitdaPct": 10.5,
     "pbr": 0.54,
     "dps": 2.5471,
     "dpsCcy": "USD",
     "payoutPct": 92.1
    },
    "base": {
     "crude": 16.66,
     "crudeGrowthPct": 2.2,
     "pi80": {
      "crude": [
       14.21,
       19.54
      ],
      "opIncomeUsdMn": [
       1050.5,
       2032.1
      ],
      "ebitdaPct": [
       8.8,
       16.3
      ],
      "pbr": [
       0.15,
       0.87
      ]
     },
     "opIncomeUsdMn": 1541.3,
     "opMarginPct": 9.7,
     "ebitdaPct": 12.5,
     "pbr": 0.51,
     "dps": 3.4335,
     "dpsCcy": "USD",
     "payoutPct": 92.1
    },
    "bull": {
     "crude": 16.75,
     "crudeGrowthPct": 2.7,
     "pi80": {
      "crude": [
       14.28,
       19.64
      ],
      "opIncomeUsdMn": [
       1449.9,
       2436.7
      ],
      "ebitdaPct": [
       10.8,
       18.3
      ],
      "pbr": [
       0.12,
       0.84
      ]
     },
     "opIncomeUsdMn": 1943.3,
     "opMarginPct": 12.1,
     "ebitdaPct": 14.6,
     "pbr": 0.48,
     "dps": 4.3291,
     "dpsCcy": "USD",
     "payoutPct": 92.1
    }
   },
   "2027": {
    "bear": {
     "crude": 16.8,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       13.41,
       21.04
      ],
      "opIncomeUsdMn": [
       188.5,
       1178.3
      ],
      "ebitdaPct": [
       4.7,
       12.3
      ],
      "pbr": [
       0.18,
       0.9
      ]
     },
     "opIncomeUsdMn": 683.4,
     "opMarginPct": 4.2,
     "ebitdaPct": 8.5,
     "pbr": 0.54,
     "dps": 1.5224,
     "dpsCcy": "USD",
     "payoutPct": 92.1
    },
    "base": {
     "crude": 17.07,
     "crudeGrowthPct": 2.4,
     "pi80": {
      "crude": [
       13.63,
       21.39
      ],
      "opIncomeUsdMn": [
       994.3,
       1999.9
      ],
      "ebitdaPct": [
       8.8,
       16.3
      ],
      "pbr": [
       0.11,
       0.83
      ]
     },
     "opIncomeUsdMn": 1497.1,
     "opMarginPct": 9.2,
     "ebitdaPct": 12.6,
     "pbr": 0.47,
     "dps": 3.335,
     "dpsCcy": "USD",
     "payoutPct": 92.1
    },
    "bull": {
     "crude": 17.35,
     "crudeGrowthPct": 3.5,
     "pi80": {
      "crude": [
       13.85,
       21.73
      ],
      "opIncomeUsdMn": [
       1825.5,
       2847.1
      ],
      "ebitdaPct": [
       12.8,
       20.4
      ],
      "pbr": [
       0.05,
       0.77
      ]
     },
     "opIncomeUsdMn": 2336.3,
     "opMarginPct": 14.1,
     "ebitdaPct": 16.6,
     "pbr": 0.41,
     "dps": 5.2045,
     "dpsCcy": "USD",
     "payoutPct": 92.1
    }
   },
   "2028": {
    "bear": {
     "crude": 17.03,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       12.92,
       22.44
      ],
      "opIncomeUsdMn": [
       191.1,
       1194.3
      ],
      "ebitdaPct": [
       4.7,
       12.3
      ],
      "pbr": [
       0.18,
       0.9
      ]
     },
     "opIncomeUsdMn": 692.7,
     "opMarginPct": 4.2,
     "ebitdaPct": 8.5,
     "pbr": 0.54,
     "dps": 1.5431,
     "dpsCcy": "USD",
     "payoutPct": 92.1
    },
    "base": {
     "crude": 17.49,
     "crudeGrowthPct": 2.4,
     "pi80": {
      "crude": [
       13.27,
       23.05
      ],
      "opIncomeUsdMn": [
       1018.5,
       2048.6
      ],
      "ebitdaPct": [
       8.8,
       16.3
      ],
      "pbr": [
       0.11,
       0.83
      ]
     },
     "opIncomeUsdMn": 1533.6,
     "opMarginPct": 9.2,
     "ebitdaPct": 12.6,
     "pbr": 0.47,
     "dps": 3.4163,
     "dpsCcy": "USD",
     "payoutPct": 92.1
    },
    "bull": {
     "crude": 17.97,
     "crudeGrowthPct": 3.5,
     "pi80": {
      "crude": [
       13.64,
       23.68
      ],
      "opIncomeUsdMn": [
       1889.7,
       2947.2
      ],
      "ebitdaPct": [
       12.8,
       20.4
      ],
      "pbr": [
       0.05,
       0.77
      ]
     },
     "opIncomeUsdMn": 2418.4,
     "opMarginPct": 14.1,
     "ebitdaPct": 16.6,
     "pbr": 0.41,
     "dps": 5.3875,
     "dpsCcy": "USD",
     "payoutPct": 92.1
    }
   }
  },
  "tsingshan": {
   "2026": {
    "bear": {
     "crude": 16.21,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       13.82,
       19.01
      ]
     }
    },
    "base": {
     "crude": 16.25,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       13.86,
       19.06
      ]
     }
    },
    "bull": {
     "crude": 16.29,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       13.89,
       19.1
      ]
     }
    }
   },
   "2027": {
    "bear": {
     "crude": 16.36,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       13.06,
       20.5
      ]
     }
    },
    "base": {
     "crude": 16.48,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       13.16,
       20.65
      ]
     }
    },
    "bull": {
     "crude": 16.61,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       13.26,
       20.8
      ]
     }
    }
   },
   "2028": {
    "bear": {
     "crude": 16.52,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       12.54,
       21.77
      ]
     }
    },
    "base": {
     "crude": 16.72,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       12.69,
       22.04
      ]
     }
    },
    "bull": {
     "crude": 16.93,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       12.85,
       22.31
      ]
     }
    }
   }
  },
  "citicsteel": {
   "2026": {
    "bear": {
     "crude": 16.03,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       13.67,
       18.79
      ],
      "opIncomeUsdMn": [
       529.4,
       1529.5
      ],
      "ebitdaPct": [
       6.5,
       14.1
      ],
      "pbr": [
       1.4,
       2.12
      ]
     },
     "opIncomeUsdMn": 1029.5,
     "opMarginPct": 6.3,
     "ebitdaPct": 10.3,
     "pbr": 1.76,
     "dps": 0.5764,
     "dpsCcy": "CNY",
     "payoutPct": 75.1
    },
    "base": {
     "crude": 16.07,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       13.7,
       18.84
      ],
      "opIncomeUsdMn": [
       928.5,
       1931.0
      ],
      "ebitdaPct": [
       8.2,
       15.7
      ],
      "pbr": [
       1.41,
       2.13
      ]
     },
     "opIncomeUsdMn": 1429.7,
     "opMarginPct": 8.8,
     "ebitdaPct": 12.0,
     "pbr": 1.77,
     "dps": 0.8005,
     "dpsCcy": "CNY",
     "payoutPct": 75.1
    },
    "bull": {
     "crude": 16.11,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       13.73,
       18.89
      ],
      "opIncomeUsdMn": [
       1329.5,
       2334.4
      ],
      "ebitdaPct": [
       9.9,
       17.4
      ],
      "pbr": [
       1.41,
       2.13
      ]
     },
     "opIncomeUsdMn": 1831.9,
     "opMarginPct": 11.2,
     "ebitdaPct": 13.6,
     "pbr": 1.77,
     "dps": 1.0256,
     "dpsCcy": "CNY",
     "payoutPct": 75.1
    }
   },
   "2027": {
    "bear": {
     "crude": 16.18,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       12.92,
       20.27
      ],
      "opIncomeUsdMn": [
       48.9,
       1058.5
      ],
      "ebitdaPct": [
       4.4,
       12.0
      ],
      "pbr": [
       1.4,
       2.12
      ]
     },
     "opIncomeUsdMn": 553.7,
     "opMarginPct": 3.4,
     "ebitdaPct": 8.2,
     "pbr": 1.76,
     "dps": 0.31,
     "dpsCcy": "CNY",
     "payoutPct": 75.1
    },
    "base": {
     "crude": 16.3,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       13.01,
       20.42
      ],
      "opIncomeUsdMn": [
       856.3,
       1873.2
      ],
      "ebitdaPct": [
       7.8,
       15.3
      ],
      "pbr": [
       1.41,
       2.13
      ]
     },
     "opIncomeUsdMn": 1364.7,
     "opMarginPct": 8.3,
     "ebitdaPct": 11.6,
     "pbr": 1.77,
     "dps": 0.7641,
     "dpsCcy": "CNY",
     "payoutPct": 75.1
    },
    "bull": {
     "crude": 16.42,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       13.11,
       20.57
      ],
      "opIncomeUsdMn": [
       1675.4,
       2699.8
      ],
      "ebitdaPct": [
       11.1,
       18.7
      ],
      "pbr": [
       1.42,
       2.14
      ]
     },
     "opIncomeUsdMn": 2187.6,
     "opMarginPct": 13.1,
     "ebitdaPct": 14.9,
     "pbr": 1.78,
     "dps": 1.2248,
     "dpsCcy": "CNY",
     "payoutPct": 75.1
    }
   },
   "2028": {
    "bear": {
     "crude": 16.33,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       12.39,
       21.52
      ],
      "opIncomeUsdMn": [
       49.4,
       1068.5
      ],
      "ebitdaPct": [
       4.4,
       12.0
      ],
      "pbr": [
       1.4,
       2.12
      ]
     },
     "opIncomeUsdMn": 559.0,
     "opMarginPct": 3.4,
     "ebitdaPct": 8.2,
     "pbr": 1.76,
     "dps": 0.3129,
     "dpsCcy": "CNY",
     "payoutPct": 75.1
    },
    "base": {
     "crude": 16.54,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       12.55,
       21.79
      ],
      "opIncomeUsdMn": [
       868.6,
       1900.2
      ],
      "ebitdaPct": [
       7.8,
       15.3
      ],
      "pbr": [
       1.41,
       2.13
      ]
     },
     "opIncomeUsdMn": 1384.4,
     "opMarginPct": 8.3,
     "ebitdaPct": 11.6,
     "pbr": 1.77,
     "dps": 0.7751,
     "dpsCcy": "CNY",
     "payoutPct": 75.1
    },
    "bull": {
     "crude": 16.74,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       12.7,
       22.06
      ],
      "opIncomeUsdMn": [
       1707.8,
       2752.0
      ],
      "ebitdaPct": [
       11.1,
       18.7
      ],
      "pbr": [
       1.42,
       2.14
      ]
     },
     "opIncomeUsdMn": 2229.9,
     "opMarginPct": 13.1,
     "ebitdaPct": 14.9,
     "pbr": 1.78,
     "dps": 1.2485,
     "dpsCcy": "CNY",
     "payoutPct": 75.1
    }
   }
  },
  "baotou": {
   "2026": {
    "bear": {
     "crude": 15.94,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       13.59,
       18.69
      ],
      "opIncomeUsdMn": [
       2.5,
       620.5
      ],
      "ebitdaPct": [
       5.6,
       13.2
      ],
      "pbr": [
       1.35,
       2.07
      ]
     },
     "opIncomeUsdMn": 311.5,
     "opMarginPct": 3.1,
     "ebitdaPct": 9.4,
     "pbr": 1.71,
     "dps": 0.0005,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 15.97,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       13.62,
       18.73
      ],
      "opIncomeUsdMn": [
       248.3,
       867.9
      ],
      "ebitdaPct": [
       7.3,
       14.9
      ],
      "pbr": [
       1.35,
       2.07
      ]
     },
     "opIncomeUsdMn": 558.1,
     "opMarginPct": 5.5,
     "ebitdaPct": 11.1,
     "pbr": 1.71,
     "dps": 0.0009,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 16.01,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       13.66,
       18.78
      ],
      "opIncomeUsdMn": [
       495.3,
       1116.4
      ],
      "ebitdaPct": [
       9.0,
       16.5
      ],
      "pbr": [
       1.35,
       2.07
      ]
     },
     "opIncomeUsdMn": 805.9,
     "opMarginPct": 8.0,
     "ebitdaPct": 12.8,
     "pbr": 1.71,
     "dps": 0.0013,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    }
   },
   "2027": {
    "bear": {
     "crude": 16.09,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       12.84,
       20.15
      ],
      "opIncomeUsdMn": [
       -297.5,
       326.4
      ],
      "ebitdaPct": [
       3.6,
       11.1
      ],
      "pbr": [
       1.35,
       2.07
      ]
     },
     "opIncomeUsdMn": 14.4,
     "opMarginPct": 0.1,
     "ebitdaPct": 7.4,
     "pbr": 1.71,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 16.21,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       12.94,
       20.3
      ],
      "opIncomeUsdMn": [
       199.0,
       827.5
      ],
      "ebitdaPct": [
       6.9,
       14.5
      ],
      "pbr": [
       1.36,
       2.07
      ]
     },
     "opIncomeUsdMn": 513.2,
     "opMarginPct": 5.0,
     "ebitdaPct": 10.7,
     "pbr": 1.71,
     "dps": 0.0008,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 16.33,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       13.03,
       20.45
      ],
      "opIncomeUsdMn": [
       702.8,
       1335.9
      ],
      "ebitdaPct": [
       10.2,
       17.8
      ],
      "pbr": [
       1.36,
       2.08
      ]
     },
     "opIncomeUsdMn": 1019.3,
     "opMarginPct": 9.9,
     "ebitdaPct": 14.0,
     "pbr": 1.72,
     "dps": 0.0017,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    }
   },
   "2028": {
    "bear": {
     "crude": 16.24,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       12.32,
       21.4
      ],
      "opIncomeUsdMn": [
       -300.3,
       329.5
      ],
      "ebitdaPct": [
       3.6,
       11.1
      ],
      "pbr": [
       1.35,
       2.07
      ]
     },
     "opIncomeUsdMn": 14.6,
     "opMarginPct": 0.1,
     "ebitdaPct": 7.4,
     "pbr": 1.71,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 16.44,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       12.48,
       21.67
      ],
      "opIncomeUsdMn": [
       201.9,
       839.4
      ],
      "ebitdaPct": [
       6.9,
       14.5
      ],
      "pbr": [
       1.36,
       2.07
      ]
     },
     "opIncomeUsdMn": 520.6,
     "opMarginPct": 5.0,
     "ebitdaPct": 10.7,
     "pbr": 1.71,
     "dps": 0.0008,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 16.65,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       12.63,
       21.94
      ],
      "opIncomeUsdMn": [
       716.4,
       1361.7
      ],
      "ebitdaPct": [
       10.2,
       17.8
      ],
      "pbr": [
       1.36,
       2.08
      ]
     },
     "opIncomeUsdMn": 1039.1,
     "opMarginPct": 9.9,
     "ebitdaPct": 14.0,
     "pbr": 1.72,
     "dps": 0.0017,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    }
   }
  },
  "shenglong": {
   "2026": {
    "bear": {
     "crude": 15.19,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       12.95,
       17.81
      ]
     }
    },
    "base": {
     "crude": 15.22,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       12.98,
       17.85
      ]
     }
    },
    "bull": {
     "crude": 15.26,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       13.01,
       17.9
      ]
     }
    }
   },
   "2027": {
    "bear": {
     "crude": 15.33,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       12.24,
       19.2
      ]
     }
    },
    "base": {
     "crude": 15.44,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       12.33,
       19.35
      ]
     }
    },
    "bull": {
     "crude": 15.56,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       12.42,
       19.49
      ]
     }
    }
   },
   "2028": {
    "bear": {
     "crude": 15.48,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       11.74,
       20.39
      ]
     }
    },
    "base": {
     "crude": 15.67,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       11.89,
       20.65
      ]
     }
    },
    "bull": {
     "crude": 15.86,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       12.04,
       20.9
      ]
     }
    }
   }
  },
  "jinansteel": {
   "2026": {
    "bear": {
     "crude": 14.94,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       12.74,
       17.52
      ]
     }
    },
    "base": {
     "crude": 14.98,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       12.77,
       17.57
      ]
     }
    },
    "bull": {
     "crude": 15.02,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       12.8,
       17.61
      ]
     }
    }
   },
   "2027": {
    "bear": {
     "crude": 15.08,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       12.04,
       18.9
      ]
     }
    },
    "base": {
     "crude": 15.2,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       12.13,
       19.04
      ]
     }
    },
    "bull": {
     "crude": 15.31,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       12.22,
       19.18
      ]
     }
    }
   },
   "2028": {
    "bear": {
     "crude": 15.23,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       11.56,
       20.07
      ]
     }
    },
    "base": {
     "crude": 15.42,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       11.7,
       20.32
      ]
     }
    },
    "bull": {
     "crude": 15.61,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       11.84,
       20.57
      ]
     }
    }
   }
  },
  "nlmk": {
   "2026": {
    "bear": {
     "crude": 13.47,
     "crudeGrowthPct": 1.0,
     "pi80": {
      "crude": [
       11.48,
       15.79
      ]
     }
    },
    "base": {
     "crude": 13.52,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       11.53,
       15.85
      ]
     }
    },
    "bull": {
     "crude": 13.57,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       11.57,
       15.91
      ]
     }
    }
   },
   "2027": {
    "bear": {
     "crude": 13.57,
     "crudeGrowthPct": 0.8,
     "pi80": {
      "crude": [
       10.83,
       17.0
      ]
     }
    },
    "base": {
     "crude": 13.72,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       10.96,
       17.19
      ]
     }
    },
    "bull": {
     "crude": 13.88,
     "crudeGrowthPct": 2.3,
     "pi80": {
      "crude": [
       11.08,
       17.39
      ]
     }
    }
   },
   "2028": {
    "bear": {
     "crude": 13.68,
     "crudeGrowthPct": 0.8,
     "pi80": {
      "crude": [
       10.38,
       18.02
      ]
     }
    },
    "base": {
     "crude": 13.93,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       10.57,
       18.36
      ]
     }
    },
    "bull": {
     "crude": 14.2,
     "crudeGrowthPct": 2.3,
     "pi80": {
      "crude": [
       10.77,
       18.71
      ]
     }
    }
   }
  },
  "gerdau": {
   "2026": {
    "bear": {
     "crude": 13.21,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       11.26,
       15.49
      ],
      "opIncomeUsdMn": [
       937.9,
       1812.2
      ],
      "ebitdaPct": [
       9.3,
       16.9
      ],
      "pbr": [
       0.49,
       1.21
      ]
     },
     "opIncomeUsdMn": 1375.0,
     "opMarginPct": 9.7,
     "ebitdaPct": 13.1,
     "pbr": 0.85,
     "dps": 0.8079,
     "dpsCcy": "BRL",
     "payoutPct": 54.9
    },
    "base": {
     "crude": 13.26,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       11.31,
       15.55
      ],
      "opIncomeUsdMn": [
       1291.2,
       2169.1
      ],
      "ebitdaPct": [
       11.2,
       18.8
      ],
      "pbr": [
       0.47,
       1.19
      ]
     },
     "opIncomeUsdMn": 1730.2,
     "opMarginPct": 12.1,
     "ebitdaPct": 15.0,
     "pbr": 0.83,
     "dps": 1.0166,
     "dpsCcy": "BRL",
     "payoutPct": 54.9
    },
    "bull": {
     "crude": 13.32,
     "crudeGrowthPct": 2.2,
     "pi80": {
      "crude": [
       11.36,
       15.62
      ],
      "opIncomeUsdMn": [
       1647.4,
       2528.9
      ],
      "ebitdaPct": [
       13.1,
       20.6
      ],
      "pbr": [
       0.46,
       1.17
      ]
     },
     "opIncomeUsdMn": 2088.2,
     "opMarginPct": 14.6,
     "ebitdaPct": 16.9,
     "pbr": 0.82,
     "dps": 1.2269,
     "dpsCcy": "BRL",
     "payoutPct": 54.9
    }
   },
   "2027": {
    "bear": {
     "crude": 13.35,
     "crudeGrowthPct": 1.1,
     "pi80": {
      "crude": [
       10.66,
       16.73
      ],
      "opIncomeUsdMn": [
       523.9,
       1408.0
      ],
      "ebitdaPct": [
       7.4,
       15.0
      ],
      "pbr": [
       0.48,
       1.2
      ]
     },
     "opIncomeUsdMn": 965.9,
     "opMarginPct": 6.7,
     "ebitdaPct": 11.2,
     "pbr": 0.84,
     "dps": 0.5675,
     "dpsCcy": "BRL",
     "payoutPct": 54.9
    },
    "base": {
     "crude": 13.52,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       10.79,
       16.94
      ],
      "opIncomeUsdMn": [
       1243.0,
       2137.9
      ],
      "ebitdaPct": [
       11.1,
       18.7
      ],
      "pbr": [
       0.44,
       1.16
      ]
     },
     "opIncomeUsdMn": 1690.5,
     "opMarginPct": 11.6,
     "ebitdaPct": 14.9,
     "pbr": 0.8,
     "dps": 0.9932,
     "dpsCcy": "BRL",
     "payoutPct": 54.9
    },
    "bull": {
     "crude": 13.69,
     "crudeGrowthPct": 2.8,
     "pi80": {
      "crude": [
       10.93,
       17.15
      ],
      "opIncomeUsdMn": [
       1979.6,
       2885.5
      ],
      "ebitdaPct": [
       14.9,
       22.4
      ],
      "pbr": [
       0.41,
       1.13
      ]
     },
     "opIncomeUsdMn": 2432.6,
     "opMarginPct": 16.5,
     "ebitdaPct": 18.6,
     "pbr": 0.77,
     "dps": 1.4292,
     "dpsCcy": "BRL",
     "payoutPct": 54.9
    }
   },
   "2028": {
    "bear": {
     "crude": 13.5,
     "crudeGrowthPct": 1.1,
     "pi80": {
      "crude": [
       10.25,
       17.79
      ],
      "opIncomeUsdMn": [
       529.8,
       1423.6
      ],
      "ebitdaPct": [
       7.4,
       15.0
      ],
      "pbr": [
       0.48,
       1.2
      ]
     },
     "opIncomeUsdMn": 976.7,
     "opMarginPct": 6.7,
     "ebitdaPct": 11.2,
     "pbr": 0.84,
     "dps": 0.5738,
     "dpsCcy": "BRL",
     "payoutPct": 54.9
    },
    "base": {
     "crude": 13.79,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       10.46,
       18.17
      ],
      "opIncomeUsdMn": [
       1267.1,
       2179.5
      ],
      "ebitdaPct": [
       11.1,
       18.7
      ],
      "pbr": [
       0.44,
       1.16
      ]
     },
     "opIncomeUsdMn": 1723.3,
     "opMarginPct": 11.6,
     "ebitdaPct": 14.9,
     "pbr": 0.8,
     "dps": 1.0125,
     "dpsCcy": "BRL",
     "payoutPct": 54.9
    },
    "bull": {
     "crude": 14.08,
     "crudeGrowthPct": 2.8,
     "pi80": {
      "crude": [
       10.68,
       18.55
      ],
      "opIncomeUsdMn": [
       2034.5,
       2965.5
      ],
      "ebitdaPct": [
       14.9,
       22.4
      ],
      "pbr": [
       0.41,
       1.13
      ]
     },
     "opIncomeUsdMn": 2500.0,
     "opMarginPct": 16.5,
     "ebitdaPct": 18.6,
     "pbr": 0.77,
     "dps": 1.4689,
     "dpsCcy": "BRL",
     "payoutPct": 54.9
    }
   }
  },
  "tosyali": {
   "2026": {
    "bear": {
     "crude": 12.35,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       10.53,
       14.48
      ]
     }
    },
    "base": {
     "crude": 12.39,
     "crudeGrowthPct": 2.3,
     "pi80": {
      "crude": [
       10.57,
       14.53
      ]
     }
    },
    "bull": {
     "crude": 12.44,
     "crudeGrowthPct": 2.7,
     "pi80": {
      "crude": [
       10.6,
       14.58
      ]
     }
    }
   },
   "2027": {
    "bear": {
     "crude": 12.58,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       10.04,
       15.76
      ]
     }
    },
    "base": {
     "crude": 12.71,
     "crudeGrowthPct": 2.6,
     "pi80": {
      "crude": [
       10.15,
       15.92
      ]
     }
    },
    "bull": {
     "crude": 12.85,
     "crudeGrowthPct": 3.3,
     "pi80": {
      "crude": [
       10.26,
       16.09
      ]
     }
    }
   },
   "2028": {
    "bear": {
     "crude": 12.81,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       9.72,
       16.88
      ]
     }
    },
    "base": {
     "crude": 13.04,
     "crudeGrowthPct": 2.6,
     "pi80": {
      "crude": [
       9.9,
       17.19
      ]
     }
    },
    "bull": {
     "crude": 13.27,
     "crudeGrowthPct": 3.3,
     "pi80": {
      "crude": [
       10.07,
       17.49
      ]
     }
    }
   }
  },
  "sinogiant": {
   "2026": {
    "bear": {
     "crude": 12.15,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       10.36,
       14.24
      ]
     }
    },
    "base": {
     "crude": 12.18,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       10.38,
       14.28
      ]
     }
    },
    "bull": {
     "crude": 12.21,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       10.41,
       14.31
      ]
     }
    }
   },
   "2027": {
    "bear": {
     "crude": 12.26,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       9.79,
       15.36
      ]
     }
    },
    "base": {
     "crude": 12.35,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       9.86,
       15.47
      ]
     }
    },
    "bull": {
     "crude": 12.45,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       9.93,
       15.59
      ]
     }
    }
   },
   "2028": {
    "bear": {
     "crude": 12.38,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       9.39,
       16.31
      ]
     }
    },
    "base": {
     "crude": 12.53,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       9.51,
       16.52
      ]
     }
    },
    "bull": {
     "crude": 12.69,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       9.63,
       16.72
      ]
     }
    }
   }
  },
  "chinasteel": {
   "2026": {
    "bear": {
     "crude": 11.89,
     "crudeGrowthPct": 2.7,
     "pi80": {
      "crude": [
       10.14,
       13.94
      ],
      "opIncomeUsdMn": [
       -384.1,
       238.8
      ],
      "ebitdaPct": [
       6.5,
       14.1
      ],
      "pbr": [
       0.77,
       1.48
      ]
     },
     "opIncomeUsdMn": -72.6,
     "opMarginPct": -0.7,
     "ebitdaPct": 10.3,
     "pbr": 1.13,
     "dps": 0.0,
     "dpsCcy": "TWD",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 11.91,
     "crudeGrowthPct": 2.9,
     "pi80": {
      "crude": [
       10.16,
       13.97
      ],
      "opIncomeUsdMn": [
       -137.6,
       486.2
      ],
      "ebitdaPct": [
       8.1,
       15.6
      ],
      "pbr": [
       0.78,
       1.5
      ]
     },
     "opIncomeUsdMn": 174.3,
     "opMarginPct": 1.7,
     "ebitdaPct": 11.9,
     "pbr": 1.14,
     "dps": 0.2854,
     "dpsCcy": "TWD",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 11.93,
     "crudeGrowthPct": 3.0,
     "pi80": {
      "crude": [
       10.17,
       13.99
      ],
      "opIncomeUsdMn": [
       109.7,
       734.4
      ],
      "ebitdaPct": [
       9.6,
       17.2
      ],
      "pbr": [
       0.79,
       1.51
      ]
     },
     "opIncomeUsdMn": 422.1,
     "opMarginPct": 4.2,
     "ebitdaPct": 13.4,
     "pbr": 1.15,
     "dps": 0.6908,
     "dpsCcy": "TWD",
     "payoutPct": 100.0
    }
   },
   "2027": {
    "bear": {
     "crude": 12.15,
     "crudeGrowthPct": 2.2,
     "pi80": {
      "crude": [
       9.7,
       15.22
      ],
      "opIncomeUsdMn": [
       -699.6,
       -63.1
      ],
      "ebitdaPct": [
       4.2,
       11.8
      ],
      "pbr": [
       0.79,
       1.51
      ]
     },
     "opIncomeUsdMn": -381.3,
     "opMarginPct": -3.7,
     "ebitdaPct": 8.0,
     "pbr": 1.15,
     "dps": 0.0,
     "dpsCcy": "TWD",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 12.21,
     "crudeGrowthPct": 2.5,
     "pi80": {
      "crude": [
       9.75,
       15.3
      ],
      "opIncomeUsdMn": [
       -196.3,
       443.1
      ],
      "ebitdaPct": [
       7.3,
       14.9
      ],
      "pbr": [
       0.82,
       1.54
      ]
     },
     "opIncomeUsdMn": 123.4,
     "opMarginPct": 1.2,
     "ebitdaPct": 11.1,
     "pbr": 1.18,
     "dps": 0.202,
     "dpsCcy": "TWD",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 12.27,
     "crudeGrowthPct": 2.8,
     "pi80": {
      "crude": [
       9.79,
       15.37
      ],
      "opIncomeUsdMn": [
       311.7,
       954.1
      ],
      "ebitdaPct": [
       10.5,
       18.0
      ],
      "pbr": [
       0.85,
       1.57
      ]
     },
     "opIncomeUsdMn": 632.9,
     "opMarginPct": 6.1,
     "ebitdaPct": 14.2,
     "pbr": 1.21,
     "dps": 1.0359,
     "dpsCcy": "TWD",
     "payoutPct": 100.0
    }
   },
   "2028": {
    "bear": {
     "crude": 12.42,
     "crudeGrowthPct": 2.2,
     "pi80": {
      "crude": [
       9.43,
       16.37
      ],
      "opIncomeUsdMn": [
       -714.9,
       -64.5
      ],
      "ebitdaPct": [
       4.2,
       11.8
      ],
      "pbr": [
       0.79,
       1.51
      ]
     },
     "opIncomeUsdMn": -389.7,
     "opMarginPct": -3.7,
     "ebitdaPct": 8.0,
     "pbr": 1.15,
     "dps": 0.0,
     "dpsCcy": "TWD",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 12.52,
     "crudeGrowthPct": 2.5,
     "pi80": {
      "crude": [
       9.5,
       16.5
      ],
      "opIncomeUsdMn": [
       -201.2,
       454.2
      ],
      "ebitdaPct": [
       7.3,
       14.9
      ],
      "pbr": [
       0.82,
       1.54
      ]
     },
     "opIncomeUsdMn": 126.5,
     "opMarginPct": 1.2,
     "ebitdaPct": 11.1,
     "pbr": 1.18,
     "dps": 0.2071,
     "dpsCcy": "TWD",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 12.62,
     "crudeGrowthPct": 2.8,
     "pi80": {
      "crude": [
       9.58,
       16.63
      ],
      "opIncomeUsdMn": [
       320.5,
       981.0
      ],
      "ebitdaPct": [
       10.5,
       18.0
      ],
      "pbr": [
       0.85,
       1.57
      ]
     },
     "opIncomeUsdMn": 650.7,
     "opMarginPct": 6.1,
     "ebitdaPct": 14.2,
     "pbr": 1.21,
     "dps": 1.0652,
     "dpsCcy": "TWD",
     "payoutPct": 100.0
    }
   }
  },
  "nanjing": {
   "2026": {
    "bear": {
     "crude": 11.5,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       9.8,
       13.48
      ],
      "opIncomeUsdMn": [
       157.2,
       697.4
      ],
      "ebitdaPct": [
       5.0,
       12.6
      ],
      "pbr": [
       0.73,
       1.45
      ]
     },
     "opIncomeUsdMn": 427.3,
     "opMarginPct": 4.9,
     "ebitdaPct": 8.8,
     "pbr": 1.09,
     "dps": 0.2121,
     "dpsCcy": "CNY",
     "payoutPct": 87.6
    },
    "base": {
     "crude": 11.53,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       9.83,
       13.52
      ],
      "opIncomeUsdMn": [
       372.5,
       913.9
      ],
      "ebitdaPct": [
       6.7,
       14.2
      ],
      "pbr": [
       0.74,
       1.46
      ]
     },
     "opIncomeUsdMn": 643.2,
     "opMarginPct": 7.3,
     "ebitdaPct": 10.5,
     "pbr": 1.1,
     "dps": 0.3192,
     "dpsCcy": "CNY",
     "payoutPct": 87.6
    },
    "bull": {
     "crude": 11.55,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       9.85,
       13.55
      ],
      "opIncomeUsdMn": [
       588.7,
       1131.5
      ],
      "ebitdaPct": [
       8.4,
       15.9
      ],
      "pbr": [
       0.74,
       1.46
      ]
     },
     "opIncomeUsdMn": 860.1,
     "opMarginPct": 9.8,
     "ebitdaPct": 12.1,
     "pbr": 1.1,
     "dps": 0.4269,
     "dpsCcy": "CNY",
     "payoutPct": 87.6
    }
   },
   "2027": {
    "bear": {
     "crude": 11.61,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       9.27,
       14.54
      ],
      "opIncomeUsdMn": [
       -103.5,
       441.8
      ],
      "ebitdaPct": [
       2.9,
       10.5
      ],
      "pbr": [
       0.73,
       1.45
      ]
     },
     "opIncomeUsdMn": 169.1,
     "opMarginPct": 1.9,
     "ebitdaPct": 6.7,
     "pbr": 1.09,
     "dps": 0.0839,
     "dpsCcy": "CNY",
     "payoutPct": 87.6
    },
    "base": {
     "crude": 11.69,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       9.33,
       14.65
      ],
      "opIncomeUsdMn": [
       331.6,
       880.9
      ],
      "ebitdaPct": [
       6.3,
       13.8
      ],
      "pbr": [
       0.74,
       1.46
      ]
     },
     "opIncomeUsdMn": 606.2,
     "opMarginPct": 6.8,
     "ebitdaPct": 10.1,
     "pbr": 1.1,
     "dps": 0.3009,
     "dpsCcy": "CNY",
     "payoutPct": 87.6
    },
    "bull": {
     "crude": 11.78,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       9.4,
       14.76
      ],
      "opIncomeUsdMn": [
       773.1,
       1326.3
      ],
      "ebitdaPct": [
       9.6,
       17.2
      ],
      "pbr": [
       0.75,
       1.47
      ]
     },
     "opIncomeUsdMn": 1049.7,
     "opMarginPct": 11.7,
     "ebitdaPct": 13.4,
     "pbr": 1.11,
     "dps": 0.521,
     "dpsCcy": "CNY",
     "payoutPct": 87.6
    }
   },
   "2028": {
    "bear": {
     "crude": 11.72,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       8.89,
       15.44
      ],
      "opIncomeUsdMn": [
       -104.5,
       445.9
      ],
      "ebitdaPct": [
       2.9,
       10.5
      ],
      "pbr": [
       0.73,
       1.45
      ]
     },
     "opIncomeUsdMn": 170.7,
     "opMarginPct": 1.9,
     "ebitdaPct": 6.7,
     "pbr": 1.09,
     "dps": 0.0847,
     "dpsCcy": "CNY",
     "payoutPct": 87.6
    },
    "base": {
     "crude": 11.86,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       9.0,
       15.63
      ],
      "opIncomeUsdMn": [
       336.4,
       893.6
      ],
      "ebitdaPct": [
       6.3,
       13.8
      ],
      "pbr": [
       0.74,
       1.46
      ]
     },
     "opIncomeUsdMn": 615.0,
     "opMarginPct": 6.8,
     "ebitdaPct": 10.1,
     "pbr": 1.1,
     "dps": 0.3052,
     "dpsCcy": "CNY",
     "payoutPct": 87.6
    },
    "bull": {
     "crude": 12.01,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       9.11,
       15.83
      ],
      "opIncomeUsdMn": [
       788.0,
       1352.0
      ],
      "ebitdaPct": [
       9.6,
       17.2
      ],
      "pbr": [
       0.75,
       1.47
      ]
     },
     "opIncomeUsdMn": 1070.0,
     "opMarginPct": 11.7,
     "ebitdaPct": 13.4,
     "pbr": 1.11,
     "dps": 0.531,
     "dpsCcy": "CNY",
     "payoutPct": 87.6
    }
   }
  },
  "anyang": {
   "2026": {
    "bear": {
     "crude": 11.14,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       9.5,
       13.07
      ],
      "opIncomeUsdMn": [
       -431.6,
       -152.2
      ],
      "ebitdaPct": [
       -5.3,
       2.3
      ],
      "pbr": [
       1.72,
       2.44
      ]
     },
     "opIncomeUsdMn": -291.9,
     "opMarginPct": -6.4,
     "ebitdaPct": -1.5,
     "pbr": 2.08
    },
    "base": {
     "crude": 11.17,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       9.53,
       13.1
      ],
      "opIncomeUsdMn": [
       -321.5,
       -41.5
      ],
      "ebitdaPct": [
       -3.6,
       4.0
      ],
      "pbr": [
       1.72,
       2.44
      ]
     },
     "opIncomeUsdMn": -181.5,
     "opMarginPct": -4.0,
     "ebitdaPct": 0.2,
     "pbr": 2.08
    },
    "bull": {
     "crude": 11.2,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       9.55,
       13.13
      ],
      "opIncomeUsdMn": [
       -210.9,
       69.8
      ],
      "ebitdaPct": [
       -1.9,
       5.6
      ],
      "pbr": [
       1.72,
       2.44
      ]
     },
     "opIncomeUsdMn": -70.6,
     "opMarginPct": -1.5,
     "ebitdaPct": 1.9,
     "pbr": 2.08
    }
   },
   "2027": {
    "bear": {
     "crude": 11.25,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       8.98,
       14.09
      ],
      "opIncomeUsdMn": [
       -571.3,
       -289.3
      ],
      "ebitdaPct": [
       -7.3,
       0.2
      ],
      "pbr": [
       1.72,
       2.44
      ]
     },
     "opIncomeUsdMn": -430.3,
     "opMarginPct": -9.4,
     "ebitdaPct": -3.5,
     "pbr": 2.08
    },
    "base": {
     "crude": 11.33,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       9.05,
       14.2
      ],
      "opIncomeUsdMn": [
       -350.1,
       -66.0
      ],
      "ebitdaPct": [
       -4.0,
       3.6
      ],
      "pbr": [
       1.73,
       2.44
      ]
     },
     "opIncomeUsdMn": -208.0,
     "opMarginPct": -4.5,
     "ebitdaPct": -0.2,
     "pbr": 2.08
    },
    "bull": {
     "crude": 11.42,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       9.11,
       14.3
      ],
      "opIncomeUsdMn": [
       -125.6,
       160.6
      ],
      "ebitdaPct": [
       -0.7,
       6.9
      ],
      "pbr": [
       1.73,
       2.45
      ]
     },
     "opIncomeUsdMn": 17.5,
     "opMarginPct": 0.4,
     "ebitdaPct": 3.1,
     "pbr": 2.09
    }
   },
   "2028": {
    "bear": {
     "crude": 11.36,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       8.62,
       14.97
      ],
      "opIncomeUsdMn": [
       -576.7,
       -292.0
      ],
      "ebitdaPct": [
       -7.3,
       0.2
      ],
      "pbr": [
       1.72,
       2.44
      ]
     },
     "opIncomeUsdMn": -434.4,
     "opMarginPct": -9.4,
     "ebitdaPct": -3.5,
     "pbr": 2.08
    },
    "base": {
     "crude": 11.5,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       8.73,
       15.15
      ],
      "opIncomeUsdMn": [
       -355.1,
       -67.0
      ],
      "ebitdaPct": [
       -4.0,
       3.6
      ],
      "pbr": [
       1.73,
       2.44
      ]
     },
     "opIncomeUsdMn": -211.0,
     "opMarginPct": -4.5,
     "ebitdaPct": -0.2,
     "pbr": 2.08
    },
    "bull": {
     "crude": 11.64,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       8.83,
       15.34
      ],
      "opIncomeUsdMn": [
       -128.0,
       163.7
      ],
      "ebitdaPct": [
       -0.7,
       6.9
      ],
      "pbr": [
       1.73,
       2.45
      ]
     },
     "opIncomeUsdMn": 17.8,
     "opMarginPct": 0.4,
     "ebitdaPct": 3.1,
     "pbr": 2.09
    }
   }
  },
  "zenith": {
   "2026": {
    "bear": {
     "crude": 11.09,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       9.46,
       13.01
      ]
     }
    },
    "base": {
     "crude": 11.12,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       9.48,
       13.04
      ]
     }
    },
    "bull": {
     "crude": 11.15,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       9.51,
       13.07
      ]
     }
    }
   },
   "2027": {
    "bear": {
     "crude": 11.2,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       8.94,
       14.03
      ]
     }
    },
    "base": {
     "crude": 11.28,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       9.01,
       14.13
      ]
     }
    },
    "bull": {
     "crude": 11.37,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       9.07,
       14.24
      ]
     }
    }
   },
   "2028": {
    "bear": {
     "crude": 11.31,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       8.58,
       14.9
      ]
     }
    },
    "base": {
     "crude": 11.45,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       8.69,
       15.08
      ]
     }
    },
    "bull": {
     "crude": 11.59,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       8.79,
       15.27
      ]
     }
    }
   }
  },
  "hoaphat": {
   "2026": {
    "bear": {
     "crude": 11.17,
     "crudeGrowthPct": 2.7,
     "pi80": {
      "crude": [
       9.53,
       13.1
      ],
      "opIncomeUsdMn": [
       412.4,
       792.8
      ],
      "ebitdaPct": [
       12.5,
       20.0
      ],
      "pbr": [
       1.2,
       1.92
      ]
     },
     "opIncomeUsdMn": 602.6,
     "opMarginPct": 9.7,
     "ebitdaPct": 16.3,
     "pbr": 1.56,
     "dps": 0.0,
     "dpsCcy": "VND",
     "payoutPct": 0.1
    },
    "base": {
     "crude": 11.19,
     "crudeGrowthPct": 2.9,
     "pi80": {
      "crude": [
       9.54,
       13.12
      ],
      "opIncomeUsdMn": [
       564.0,
       945.0
      ],
      "ebitdaPct": [
       14.0,
       21.6
      ],
      "pbr": [
       1.21,
       1.93
      ]
     },
     "opIncomeUsdMn": 754.5,
     "opMarginPct": 12.2,
     "ebitdaPct": 17.8,
     "pbr": 1.57,
     "dps": 0.0,
     "dpsCcy": "VND",
     "payoutPct": 0.1
    },
    "bull": {
     "crude": 11.21,
     "crudeGrowthPct": 3.0,
     "pi80": {
      "crude": [
       9.56,
       13.14
      ],
      "opIncomeUsdMn": [
       716.0,
       1097.6
      ],
      "ebitdaPct": [
       15.6,
       23.2
      ],
      "pbr": [
       1.23,
       1.95
      ]
     },
     "opIncomeUsdMn": 906.8,
     "opMarginPct": 14.6,
     "ebitdaPct": 19.4,
     "pbr": 1.59,
     "dps": 0.0,
     "dpsCcy": "VND",
     "payoutPct": 0.1
    }
   },
   "2027": {
    "bear": {
     "crude": 11.42,
     "crudeGrowthPct": 2.2,
     "pi80": {
      "crude": [
       9.11,
       14.3
      ],
      "opIncomeUsdMn": [
       233.9,
       622.6
      ],
      "ebitdaPct": [
       10.2,
       17.7
      ],
      "pbr": [
       1.23,
       1.94
      ]
     },
     "opIncomeUsdMn": 428.2,
     "opMarginPct": 6.8,
     "ebitdaPct": 13.9,
     "pbr": 1.58,
     "dps": 0.0,
     "dpsCcy": "VND",
     "payoutPct": 0.1
    },
    "base": {
     "crude": 11.47,
     "crudeGrowthPct": 2.5,
     "pi80": {
      "crude": [
       9.16,
       14.37
      ],
      "opIncomeUsdMn": [
       544.3,
       934.9
      ],
      "ebitdaPct": [
       13.3,
       20.9
      ],
      "pbr": [
       1.25,
       1.97
      ]
     },
     "opIncomeUsdMn": 739.6,
     "opMarginPct": 11.7,
     "ebitdaPct": 17.1,
     "pbr": 1.61,
     "dps": 0.0,
     "dpsCcy": "VND",
     "payoutPct": 0.1
    },
    "bull": {
     "crude": 11.53,
     "crudeGrowthPct": 2.8,
     "pi80": {
      "crude": [
       9.2,
       14.44
      ],
      "opIncomeUsdMn": [
       857.7,
       1250.1
      ],
      "ebitdaPct": [
       16.4,
       24.0
      ],
      "pbr": [
       1.28,
       2.0
      ]
     },
     "opIncomeUsdMn": 1053.9,
     "opMarginPct": 16.5,
     "ebitdaPct": 20.2,
     "pbr": 1.64,
     "dps": 0.0,
     "dpsCcy": "VND",
     "payoutPct": 0.1
    }
   },
   "2028": {
    "bear": {
     "crude": 11.67,
     "crudeGrowthPct": 2.2,
     "pi80": {
      "crude": [
       8.86,
       15.38
      ],
      "opIncomeUsdMn": [
       239.0,
       636.2
      ],
      "ebitdaPct": [
       10.2,
       17.7
      ],
      "pbr": [
       1.23,
       1.94
      ]
     },
     "opIncomeUsdMn": 437.6,
     "opMarginPct": 6.8,
     "ebitdaPct": 13.9,
     "pbr": 1.58,
     "dps": 0.0,
     "dpsCcy": "VND",
     "payoutPct": 0.1
    },
    "base": {
     "crude": 11.76,
     "crudeGrowthPct": 2.5,
     "pi80": {
      "crude": [
       8.93,
       15.5
      ],
      "opIncomeUsdMn": [
       558.0,
       958.3
      ],
      "ebitdaPct": [
       13.3,
       20.9
      ],
      "pbr": [
       1.25,
       1.97
      ]
     },
     "opIncomeUsdMn": 758.1,
     "opMarginPct": 11.7,
     "ebitdaPct": 17.1,
     "pbr": 1.61,
     "dps": 0.0,
     "dpsCcy": "VND",
     "payoutPct": 0.1
    },
    "bull": {
     "crude": 11.86,
     "crudeGrowthPct": 2.8,
     "pi80": {
      "crude": [
       9.0,
       15.63
      ],
      "opIncomeUsdMn": [
       881.9,
       1285.4
      ],
      "ebitdaPct": [
       16.4,
       24.0
      ],
      "pbr": [
       1.28,
       2.0
      ]
     },
     "opIncomeUsdMn": 1083.6,
     "opMarginPct": 16.5,
     "ebitdaPct": 20.2,
     "pbr": 1.64,
     "dps": 0.0,
     "dpsCcy": "VND",
     "payoutPct": 0.1
    }
   }
  },
  "severstal": {
   "2026": {
    "bear": {
     "crude": 10.93,
     "crudeGrowthPct": 1.0,
     "pi80": {
      "crude": [
       9.32,
       12.82
      ]
     }
    },
    "base": {
     "crude": 10.97,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       9.36,
       12.87
      ]
     }
    },
    "bull": {
     "crude": 11.01,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       9.39,
       12.92
      ]
     }
    }
   },
   "2027": {
    "bear": {
     "crude": 11.02,
     "crudeGrowthPct": 0.8,
     "pi80": {
      "crude": [
       8.79,
       13.8
      ]
     }
    },
    "base": {
     "crude": 11.14,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       8.89,
       13.96
      ]
     }
    },
    "bull": {
     "crude": 11.27,
     "crudeGrowthPct": 2.3,
     "pi80": {
      "crude": [
       8.99,
       14.11
      ]
     }
    }
   },
   "2028": {
    "bear": {
     "crude": 11.1,
     "crudeGrowthPct": 0.8,
     "pi80": {
      "crude": [
       8.42,
       14.63
      ]
     }
    },
    "base": {
     "crude": 11.31,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       8.58,
       14.9
      ]
     }
    },
    "bull": {
     "crude": 11.52,
     "crudeGrowthPct": 2.3,
     "pi80": {
      "crude": [
       8.75,
       15.19
      ]
     }
    }
   }
  },
  "stld": {
   "2026": {
    "bear": {
     "crude": 10.9,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       9.29,
       12.78
      ],
      "opIncomeUsdMn": [
       1684.4,
       2823.6
      ],
      "ebitdaPct": [
       10.7,
       18.3
      ],
      "pbr": [
       1.93,
       2.65
      ]
     },
     "opIncomeUsdMn": 2254.0,
     "opMarginPct": 12.2,
     "ebitdaPct": 14.5,
     "pbr": 2.29,
     "dps": 1.7592,
     "dpsCcy": "USD",
     "payoutPct": 18.0
    },
    "base": {
     "crude": 10.91,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       9.3,
       12.79
      ],
      "opIncomeUsdMn": [
       2136.1,
       3276.0
      ],
      "ebitdaPct": [
       12.2,
       19.7
      ],
      "pbr": [
       1.96,
       2.68
      ]
     },
     "opIncomeUsdMn": 2706.0,
     "opMarginPct": 14.6,
     "ebitdaPct": 15.9,
     "pbr": 2.32,
     "dps": 2.1121,
     "dpsCcy": "USD",
     "payoutPct": 18.0
    },
    "bull": {
     "crude": 10.91,
     "crudeGrowthPct": 2.0,
     "pi80": {
      "crude": [
       9.31,
       12.8
      ],
      "opIncomeUsdMn": [
       2588.3,
       3729.0
      ],
      "ebitdaPct": [
       13.6,
       21.2
      ],
      "pbr": [
       1.99,
       2.7
      ]
     },
     "opIncomeUsdMn": 3158.7,
     "opMarginPct": 17.0,
     "ebitdaPct": 17.4,
     "pbr": 2.34,
     "dps": 2.4654,
     "dpsCcy": "USD",
     "payoutPct": 18.0
    }
   },
   "2027": {
    "bear": {
     "crude": 11.09,
     "crudeGrowthPct": 1.7,
     "pi80": {
      "crude": [
       8.85,
       13.89
      ],
      "opIncomeUsdMn": [
       1158.1,
       2316.9
      ],
      "ebitdaPct": [
       8.9,
       16.5
      ],
      "pbr": [
       1.91,
       2.63
      ]
     },
     "opIncomeUsdMn": 1737.5,
     "opMarginPct": 9.2,
     "ebitdaPct": 12.7,
     "pbr": 2.27,
     "dps": 1.3562,
     "dpsCcy": "USD",
     "payoutPct": 18.0
    },
    "base": {
     "crude": 11.11,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       8.87,
       13.92
      ],
      "opIncomeUsdMn": [
       2078.3,
       3239.3
      ],
      "ebitdaPct": [
       11.8,
       19.4
      ],
      "pbr": [
       1.96,
       2.68
      ]
     },
     "opIncomeUsdMn": 2658.8,
     "opMarginPct": 14.1,
     "ebitdaPct": 15.6,
     "pbr": 2.32,
     "dps": 2.0752,
     "dpsCcy": "USD",
     "payoutPct": 18.0
    },
    "bull": {
     "crude": 11.13,
     "crudeGrowthPct": 2.0,
     "pi80": {
      "crude": [
       8.89,
       13.94
      ],
      "opIncomeUsdMn": [
       3002.0,
       4165.3
      ],
      "ebitdaPct": [
       14.7,
       22.3
      ],
      "pbr": [
       2.01,
       2.73
      ]
     },
     "opIncomeUsdMn": 3583.6,
     "opMarginPct": 19.0,
     "ebitdaPct": 18.5,
     "pbr": 2.37,
     "dps": 2.797,
     "dpsCcy": "USD",
     "payoutPct": 18.0
    }
   },
   "2028": {
    "bear": {
     "crude": 11.28,
     "crudeGrowthPct": 1.7,
     "pi80": {
      "crude": [
       8.56,
       14.86
      ],
      "opIncomeUsdMn": [
       1178.0,
       2356.7
      ],
      "ebitdaPct": [
       8.9,
       16.5
      ],
      "pbr": [
       1.91,
       2.63
      ]
     },
     "opIncomeUsdMn": 1767.4,
     "opMarginPct": 9.2,
     "ebitdaPct": 12.7,
     "pbr": 2.27,
     "dps": 1.3795,
     "dpsCcy": "USD",
     "payoutPct": 18.0
    },
    "base": {
     "crude": 11.32,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       8.59,
       14.91
      ],
      "opIncomeUsdMn": [
       2116.7,
       3299.2
      ],
      "ebitdaPct": [
       11.8,
       19.4
      ],
      "pbr": [
       1.96,
       2.68
      ]
     },
     "opIncomeUsdMn": 2708.0,
     "opMarginPct": 14.1,
     "ebitdaPct": 15.6,
     "pbr": 2.32,
     "dps": 2.1136,
     "dpsCcy": "USD",
     "payoutPct": 18.0
    },
    "bull": {
     "crude": 11.35,
     "crudeGrowthPct": 2.0,
     "pi80": {
      "crude": [
       8.62,
       14.96
      ],
      "opIncomeUsdMn": [
       3061.4,
       4247.7
      ],
      "ebitdaPct": [
       14.7,
       22.3
      ],
      "pbr": [
       2.01,
       2.73
      ]
     },
     "opIncomeUsdMn": 3654.6,
     "opMarginPct": 19.0,
     "ebitdaPct": 18.5,
     "pbr": 2.37,
     "dps": 2.8524,
     "dpsCcy": "USD",
     "payoutPct": 18.0
    }
   }
  },
  "sanming": {
   "2026": {
    "bear": {
     "crude": 10.74,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       9.16,
       12.59
      ],
      "opIncomeUsdMn": [
       -250.2,
       150.6
      ],
      "ebitdaPct": [
       -2.2,
       5.4
      ],
      "pbr": [
       0.17,
       0.89
      ]
     },
     "opIncomeUsdMn": -49.8,
     "opMarginPct": -0.8,
     "ebitdaPct": 1.6,
     "pbr": 0.53,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 10.76,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       9.18,
       12.62
      ],
      "opIncomeUsdMn": [
       -91.4,
       310.4
      ],
      "ebitdaPct": [
       -0.5,
       7.1
      ],
      "pbr": [
       0.18,
       0.9
      ]
     },
     "opIncomeUsdMn": 109.5,
     "opMarginPct": 1.7,
     "ebitdaPct": 3.3,
     "pbr": 0.54,
     "dps": 0.0088,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 10.79,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       9.2,
       12.66
      ],
      "opIncomeUsdMn": [
       68.2,
       470.9
      ],
      "ebitdaPct": [
       1.2,
       8.7
      ],
      "pbr": [
       0.18,
       0.9
      ]
     },
     "opIncomeUsdMn": 269.5,
     "opMarginPct": 4.1,
     "ebitdaPct": 5.0,
     "pbr": 0.54,
     "dps": 0.0216,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    }
   },
   "2027": {
    "bear": {
     "crude": 10.84,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       8.65,
       13.58
      ],
      "opIncomeUsdMn": [
       -447.1,
       -42.5
      ],
      "ebitdaPct": [
       -4.2,
       3.3
      ],
      "pbr": [
       0.17,
       0.89
      ]
     },
     "opIncomeUsdMn": -244.8,
     "opMarginPct": -3.7,
     "ebitdaPct": -0.4,
     "pbr": 0.53,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 10.92,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       8.72,
       13.68
      ],
      "opIncomeUsdMn": [
       -127.0,
       280.5
      ],
      "ebitdaPct": [
       -0.9,
       6.7
      ],
      "pbr": [
       0.18,
       0.9
      ]
     },
     "opIncomeUsdMn": 76.8,
     "opMarginPct": 1.2,
     "ebitdaPct": 2.9,
     "pbr": 0.54,
     "dps": 0.0062,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 11.0,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       8.78,
       13.78
      ],
      "opIncomeUsdMn": [
       197.8,
       608.3
      ],
      "ebitdaPct": [
       2.4,
       10.0
      ],
      "pbr": [
       0.19,
       0.91
      ]
     },
     "opIncomeUsdMn": 403.1,
     "opMarginPct": 6.0,
     "ebitdaPct": 6.2,
     "pbr": 0.55,
     "dps": 0.0323,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    }
   },
   "2028": {
    "bear": {
     "crude": 10.94,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       8.3,
       14.42
      ],
      "opIncomeUsdMn": [
       -451.3,
       -42.9
      ],
      "ebitdaPct": [
       -4.2,
       3.3
      ],
      "pbr": [
       0.17,
       0.89
      ]
     },
     "opIncomeUsdMn": -247.1,
     "opMarginPct": -3.7,
     "ebitdaPct": -0.4,
     "pbr": 0.53,
     "dps": 0.0,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "base": {
     "crude": 11.08,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       8.41,
       14.6
      ],
      "opIncomeUsdMn": [
       -128.8,
       284.6
      ],
      "ebitdaPct": [
       -0.9,
       6.7
      ],
      "pbr": [
       0.18,
       0.9
      ]
     },
     "opIncomeUsdMn": 77.9,
     "opMarginPct": 1.2,
     "ebitdaPct": 2.9,
     "pbr": 0.54,
     "dps": 0.0062,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    },
    "bull": {
     "crude": 11.22,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       8.51,
       14.78
      ],
      "opIncomeUsdMn": [
       201.7,
       620.1
      ],
      "ebitdaPct": [
       2.4,
       10.0
      ],
      "pbr": [
       0.19,
       0.91
      ]
     },
     "opIncomeUsdMn": 410.9,
     "opMarginPct": 6.0,
     "ebitdaPct": 6.2,
     "pbr": 0.55,
     "dps": 0.033,
     "dpsCcy": "CNY",
     "payoutPct": 100.0
    }
   }
  },
  "puyang": {
   "2026": {
    "bear": {
     "crude": 10.66,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       9.09,
       12.5
      ]
     }
    },
    "base": {
     "crude": 10.68,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       9.11,
       12.53
      ]
     }
    },
    "bull": {
     "crude": 10.71,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       9.13,
       12.56
      ]
     }
    }
   },
   "2027": {
    "bear": {
     "crude": 10.76,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       8.59,
       13.48
      ]
     }
    },
    "base": {
     "crude": 10.84,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       8.65,
       13.58
      ]
     }
    },
    "bull": {
     "crude": 10.92,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       8.72,
       13.68
      ]
     }
    }
   },
   "2028": {
    "bear": {
     "crude": 10.86,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       8.24,
       14.31
      ]
     }
    },
    "base": {
     "crude": 11.0,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       8.34,
       14.49
      ]
     }
    },
    "bull": {
     "crude": 11.13,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       8.45,
       14.67
      ]
     }
    }
   }
  },
  "mobarakeh": {
   "2026": {
    "bear": {
     "crude": 10.49,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       8.94,
       12.3
      ]
     }
    },
    "base": {
     "crude": 10.52,
     "crudeGrowthPct": 2.2,
     "pi80": {
      "crude": [
       8.97,
       12.34
      ]
     }
    },
    "bull": {
     "crude": 10.56,
     "crudeGrowthPct": 2.6,
     "pi80": {
      "crude": [
       9.0,
       12.38
      ]
     }
    }
   },
   "2027": {
    "bear": {
     "crude": 10.66,
     "crudeGrowthPct": 1.6,
     "pi80": {
      "crude": [
       8.51,
       13.35
      ]
     }
    },
    "base": {
     "crude": 10.76,
     "crudeGrowthPct": 2.3,
     "pi80": {
      "crude": [
       8.59,
       13.48
      ]
     }
    },
    "bull": {
     "crude": 10.87,
     "crudeGrowthPct": 2.9,
     "pi80": {
      "crude": [
       8.68,
       13.62
      ]
     }
    }
   },
   "2028": {
    "bear": {
     "crude": 10.83,
     "crudeGrowthPct": 1.6,
     "pi80": {
      "crude": [
       8.22,
       14.27
      ]
     }
    },
    "base": {
     "crude": 11.01,
     "crudeGrowthPct": 2.3,
     "pi80": {
      "crude": [
       8.36,
       14.51
      ]
     }
    },
    "bull": {
     "crude": 11.19,
     "crudeGrowthPct": 2.9,
     "pi80": {
      "crude": [
       8.5,
       14.75
      ]
     }
    }
   }
  },
  "mmk": {
   "2026": {
    "bear": {
     "crude": 10.27,
     "crudeGrowthPct": 1.0,
     "pi80": {
      "crude": [
       8.75,
       12.04
      ]
     }
    },
    "base": {
     "crude": 10.3,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       8.79,
       12.08
      ]
     }
    },
    "bull": {
     "crude": 10.34,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       8.82,
       12.13
      ]
     }
    }
   },
   "2027": {
    "bear": {
     "crude": 10.34,
     "crudeGrowthPct": 0.8,
     "pi80": {
      "crude": [
       8.26,
       12.96
      ]
     }
    },
    "base": {
     "crude": 10.46,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       8.35,
       13.1
      ]
     }
    },
    "bull": {
     "crude": 10.58,
     "crudeGrowthPct": 2.3,
     "pi80": {
      "crude": [
       8.45,
       13.25
      ]
     }
    }
   },
   "2028": {
    "bear": {
     "crude": 10.42,
     "crudeGrowthPct": 0.8,
     "pi80": {
      "crude": [
       7.91,
       13.74
      ]
     }
    },
    "base": {
     "crude": 10.62,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       8.06,
       14.0
      ]
     }
    },
    "bull": {
     "crude": 10.82,
     "crudeGrowthPct": 2.3,
     "pi80": {
      "crude": [
       8.21,
       14.26
      ]
     }
    }
   }
  },
  "donghua": {
   "2026": {
    "bear": {
     "crude": 9.83,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       8.38,
       11.52
      ]
     }
    },
    "base": {
     "crude": 9.85,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       8.4,
       11.55
      ]
     }
    },
    "bull": {
     "crude": 9.88,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       8.42,
       11.58
      ]
     }
    }
   },
   "2027": {
    "bear": {
     "crude": 9.92,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       7.92,
       12.43
      ]
     }
    },
    "base": {
     "crude": 9.99,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       7.98,
       12.52
      ]
     }
    },
    "bull": {
     "crude": 10.07,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       8.04,
       12.61
      ]
     }
    }
   },
   "2028": {
    "bear": {
     "crude": 10.01,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       7.6,
       13.2
      ]
     }
    },
    "base": {
     "crude": 10.14,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       7.69,
       13.36
      ]
     }
    },
    "bull": {
     "crude": 10.26,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       7.79,
       13.53
      ]
     }
    }
   }
  },
  "shaanxi": {
   "2026": {
    "bear": {
     "crude": 9.56,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       8.15,
       11.21
      ]
     }
    },
    "base": {
     "crude": 9.59,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       8.17,
       11.24
      ]
     }
    },
    "bull": {
     "crude": 9.61,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       8.2,
       11.27
      ]
     }
    }
   },
   "2027": {
    "bear": {
     "crude": 9.65,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       7.71,
       12.09
      ]
     }
    },
    "base": {
     "crude": 9.73,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       7.76,
       12.18
      ]
     }
    },
    "bull": {
     "crude": 9.8,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       7.82,
       12.27
      ]
     }
    }
   },
   "2028": {
    "bear": {
     "crude": 9.75,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       7.4,
       12.84
      ]
     }
    },
    "base": {
     "crude": 9.87,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       7.49,
       13.0
      ]
     }
    },
    "bull": {
     "crude": 9.99,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       7.58,
       13.16
      ]
     }
    }
   }
  },
  "thyssenkrupp": {
   "2026": {
    "bear": {
     "crude": 9.52,
     "crudeGrowthPct": 1.2,
     "pi80": {
      "crude": [
       8.12,
       11.16
      ],
      "opIncomeUsdMn": [
       -2790.1,
       -504.4
      ],
      "ebitdaPct": [
       1.2,
       8.8
      ],
      "pbr": [
       0.05,
       0.67
      ]
     },
     "opIncomeUsdMn": -1647.3,
     "opMarginPct": -4.4,
     "ebitdaPct": 5.0,
     "pbr": 0.31
    },
    "base": {
     "crude": 9.54,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       8.13,
       11.18
      ],
      "opIncomeUsdMn": [
       -1887.8,
       402.4
      ],
      "ebitdaPct": [
       2.8,
       10.4
      ],
      "pbr": [
       0.05,
       0.68
      ]
     },
     "opIncomeUsdMn": -742.7,
     "opMarginPct": -2.0,
     "ebitdaPct": 6.6,
     "pbr": 0.32
    },
    "bull": {
     "crude": 9.56,
     "crudeGrowthPct": 1.6,
     "pi80": {
      "crude": [
       8.15,
       11.21
      ],
      "opIncomeUsdMn": [
       -982.0,
       1312.7
      ],
      "ebitdaPct": [
       4.4,
       12.0
      ],
      "pbr": [
       0.05,
       0.69
      ]
     },
     "opIncomeUsdMn": 165.4,
     "opMarginPct": 0.4,
     "ebitdaPct": 8.2,
     "pbr": 0.33
    }
   },
   "2027": {
    "bear": {
     "crude": 9.63,
     "crudeGrowthPct": 1.2,
     "pi80": {
      "crude": [
       7.69,
       12.07
      ],
      "opIncomeUsdMn": [
       -3930.8,
       -1617.2
      ],
      "ebitdaPct": [
       -0.5,
       7.1
      ],
      "pbr": [
       0.05,
       0.63
      ]
     },
     "opIncomeUsdMn": -2774.0,
     "opMarginPct": -7.4,
     "ebitdaPct": 3.3,
     "pbr": 0.28
    },
    "base": {
     "crude": 9.69,
     "crudeGrowthPct": 1.6,
     "pi80": {
      "crude": [
       7.74,
       12.14
      ],
      "opIncomeUsdMn": [
       -2109.0,
       218.0
      ],
      "ebitdaPct": [
       2.7,
       10.3
      ],
      "pbr": [
       0.05,
       0.65
      ]
     },
     "opIncomeUsdMn": -945.5,
     "opMarginPct": -2.5,
     "ebitdaPct": 6.5,
     "pbr": 0.29
    },
    "bull": {
     "crude": 9.75,
     "crudeGrowthPct": 2.0,
     "pi80": {
      "crude": [
       7.78,
       12.21
      ],
      "opIncomeUsdMn": [
       -265.9,
       2074.8
      ],
      "ebitdaPct": [
       5.9,
       13.5
      ],
      "pbr": [
       0.05,
       0.67
      ]
     },
     "opIncomeUsdMn": 904.5,
     "opMarginPct": 2.4,
     "ebitdaPct": 9.7,
     "pbr": 0.31
    }
   },
   "2028": {
    "bear": {
     "crude": 9.75,
     "crudeGrowthPct": 1.2,
     "pi80": {
      "crude": [
       7.4,
       12.85
      ],
      "opIncomeUsdMn": [
       -3978.5,
       -1636.9
      ],
      "ebitdaPct": [
       -0.5,
       7.1
      ],
      "pbr": [
       0.05,
       0.63
      ]
     },
     "opIncomeUsdMn": -2807.7,
     "opMarginPct": -7.4,
     "ebitdaPct": 3.3,
     "pbr": 0.28
    },
    "base": {
     "crude": 9.85,
     "crudeGrowthPct": 1.6,
     "pi80": {
      "crude": [
       7.47,
       12.98
      ],
      "opIncomeUsdMn": [
       -2143.0,
       221.5
      ],
      "ebitdaPct": [
       2.7,
       10.3
      ],
      "pbr": [
       0.05,
       0.65
      ]
     },
     "opIncomeUsdMn": -960.7,
     "opMarginPct": -2.5,
     "ebitdaPct": 6.5,
     "pbr": 0.29
    },
    "bull": {
     "crude": 9.95,
     "crudeGrowthPct": 2.0,
     "pi80": {
      "crude": [
       7.55,
       13.11
      ],
      "opIncomeUsdMn": [
       -271.2,
       2116.3
      ],
      "ebitdaPct": [
       5.9,
       13.5
      ],
      "pbr": [
       0.05,
       0.67
      ]
     },
     "opIncomeUsdMn": 922.6,
     "opMarginPct": 2.4,
     "ebitdaPct": 9.7,
     "pbr": 0.31
    }
   }
  },
  "jindal": {
   "2026": {
    "bear": {
     "crude": 8.99,
     "crudeGrowthPct": 3.2,
     "pi80": {
      "crude": [
       7.67,
       10.55
      ],
      "opIncomeUsdMn": [
       556.4,
       847.0
      ],
      "ebitdaPct": [
       17.2,
       24.8
      ],
      "pbr": [
       1.74,
       2.46
      ]
     },
     "opIncomeUsdMn": 701.7,
     "opMarginPct": 14.9,
     "ebitdaPct": 21.0,
     "pbr": 2.1,
     "dps": 1.9831,
     "dpsCcy": "INR",
     "payoutPct": 5.5
    },
    "base": {
     "crude": 9.01,
     "crudeGrowthPct": 3.4,
     "pi80": {
      "crude": [
       7.69,
       10.57
      ],
      "opIncomeUsdMn": [
       673.0,
       964.2
      ],
      "ebitdaPct": [
       18.8,
       26.4
      ],
      "pbr": [
       1.75,
       2.47
      ]
     },
     "opIncomeUsdMn": 818.6,
     "opMarginPct": 17.3,
     "ebitdaPct": 22.6,
     "pbr": 2.11,
     "dps": 2.3134,
     "dpsCcy": "INR",
     "payoutPct": 5.5
    },
    "bull": {
     "crude": 9.03,
     "crudeGrowthPct": 3.6,
     "pi80": {
      "crude": [
       7.7,
       10.59
      ],
      "opIncomeUsdMn": [
       790.1,
       1081.9
      ],
      "ebitdaPct": [
       20.5,
       28.0
      ],
      "pbr": [
       1.75,
       2.47
      ]
     },
     "opIncomeUsdMn": 936.0,
     "opMarginPct": 19.7,
     "ebitdaPct": 24.2,
     "pbr": 2.11,
     "dps": 2.6452,
     "dpsCcy": "INR",
     "payoutPct": 5.5
    }
   },
   "2027": {
    "bear": {
     "crude": 9.27,
     "crudeGrowthPct": 3.0,
     "pi80": {
      "crude": [
       7.4,
       11.62
      ],
      "opIncomeUsdMn": [
       429.8,
       729.2
      ],
      "ebitdaPct": [
       15.3,
       22.9
      ],
      "pbr": [
       1.72,
       2.44
      ]
     },
     "opIncomeUsdMn": 579.5,
     "opMarginPct": 11.9,
     "ebitdaPct": 19.1,
     "pbr": 2.08,
     "dps": 1.6378,
     "dpsCcy": "INR",
     "payoutPct": 5.5
    },
    "base": {
     "crude": 9.33,
     "crudeGrowthPct": 3.5,
     "pi80": {
      "crude": [
       7.45,
       11.69
      ],
      "opIncomeUsdMn": [
       671.4,
       972.7
      ],
      "ebitdaPct": [
       18.6,
       26.2
      ],
      "pbr": [
       1.73,
       2.45
      ]
     },
     "opIncomeUsdMn": 822.1,
     "opMarginPct": 16.8,
     "ebitdaPct": 22.4,
     "pbr": 2.09,
     "dps": 2.3233,
     "dpsCcy": "INR",
     "payoutPct": 5.5
    },
    "bull": {
     "crude": 9.39,
     "crudeGrowthPct": 3.9,
     "pi80": {
      "crude": [
       7.5,
       11.77
      ],
      "opIncomeUsdMn": [
       916.0,
       1219.2
      ],
      "ebitdaPct": [
       21.9,
       29.4
      ],
      "pbr": [
       1.75,
       2.47
      ]
     },
     "opIncomeUsdMn": 1067.6,
     "opMarginPct": 21.7,
     "ebitdaPct": 25.6,
     "pbr": 2.11,
     "dps": 3.0171,
     "dpsCcy": "INR",
     "payoutPct": 5.5
    }
   },
   "2028": {
    "bear": {
     "crude": 9.56,
     "crudeGrowthPct": 3.0,
     "pi80": {
      "crude": [
       7.25,
       12.6
      ],
      "opIncomeUsdMn": [
       442.9,
       751.5
      ],
      "ebitdaPct": [
       15.3,
       22.9
      ],
      "pbr": [
       1.72,
       2.44
      ]
     },
     "opIncomeUsdMn": 597.2,
     "opMarginPct": 11.9,
     "ebitdaPct": 19.1,
     "pbr": 2.08,
     "dps": 1.6877,
     "dpsCcy": "INR",
     "payoutPct": 5.5
    },
    "base": {
     "crude": 9.66,
     "crudeGrowthPct": 3.5,
     "pi80": {
      "crude": [
       7.33,
       12.73
      ],
      "opIncomeUsdMn": [
       694.8,
       1006.5
      ],
      "ebitdaPct": [
       18.6,
       26.2
      ],
      "pbr": [
       1.73,
       2.45
      ]
     },
     "opIncomeUsdMn": 850.7,
     "opMarginPct": 16.8,
     "ebitdaPct": 22.4,
     "pbr": 2.09,
     "dps": 2.404,
     "dpsCcy": "INR",
     "payoutPct": 5.5
    },
    "bull": {
     "crude": 9.77,
     "crudeGrowthPct": 3.9,
     "pi80": {
      "crude": [
       7.41,
       12.87
      ],
      "opIncomeUsdMn": [
       951.8,
       1266.8
      ],
      "ebitdaPct": [
       21.9,
       29.4
      ],
      "pbr": [
       1.75,
       2.47
      ]
     },
     "opIncomeUsdMn": 1109.3,
     "opMarginPct": 21.7,
     "ebitdaPct": 25.6,
     "pbr": 2.11,
     "dps": 3.135,
     "dpsCcy": "INR",
     "payoutPct": 5.5
    }
   }
  },
  "jiuquan": {
   "2026": {
    "bear": {
     "crude": 8.6,
     "crudeGrowthPct": 1.3,
     "pi80": {
      "crude": [
       7.33,
       10.09
      ],
      "opIncomeUsdMn": [
       -319.6,
       -34.9
      ],
      "ebitdaPct": [
       -4.6,
       2.9
      ],
      "pbr": [
       1.06,
       1.78
      ]
     },
     "opIncomeUsdMn": -177.3,
     "opMarginPct": -3.8,
     "ebitdaPct": -0.8,
     "pbr": 1.42
    },
    "base": {
     "crude": 8.62,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       7.35,
       10.11
      ],
      "opIncomeUsdMn": [
       -207.2,
       78.3
      ],
      "ebitdaPct": [
       -2.9,
       4.6
      ],
      "pbr": [
       1.07,
       1.79
      ]
     },
     "opIncomeUsdMn": -64.4,
     "opMarginPct": -1.4,
     "ebitdaPct": 0.8,
     "pbr": 1.43
    },
    "bull": {
     "crude": 8.64,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       7.37,
       10.14
      ],
      "opIncomeUsdMn": [
       -94.1,
       192.0
      ],
      "ebitdaPct": [
       -1.3,
       6.3
      ],
      "pbr": [
       1.07,
       1.79
      ]
     },
     "opIncomeUsdMn": 48.9,
     "opMarginPct": 1.1,
     "ebitdaPct": 2.5,
     "pbr": 1.43
    }
   },
   "2027": {
    "bear": {
     "crude": 8.68,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       6.93,
       10.88
      ],
      "opIncomeUsdMn": [
       -460.9,
       -173.5
      ],
      "ebitdaPct": [
       -6.7,
       0.9
      ],
      "pbr": [
       1.06,
       1.78
      ]
     },
     "opIncomeUsdMn": -317.2,
     "opMarginPct": -6.8,
     "ebitdaPct": -2.9,
     "pbr": 1.42
    },
    "base": {
     "crude": 8.75,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       6.98,
       10.96
      ],
      "opIncomeUsdMn": [
       -234.5,
       55.0
      ],
      "ebitdaPct": [
       -3.4,
       4.2
      ],
      "pbr": [
       1.07,
       1.79
      ]
     },
     "opIncomeUsdMn": -89.7,
     "opMarginPct": -1.9,
     "ebitdaPct": 0.4,
     "pbr": 1.43
    },
    "bull": {
     "crude": 8.81,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       7.03,
       11.04
      ],
      "opIncomeUsdMn": [
       -4.8,
       286.9
      ],
      "ebitdaPct": [
       -0.0,
       7.5
      ],
      "pbr": [
       1.08,
       1.8
      ]
     },
     "opIncomeUsdMn": 141.1,
     "opMarginPct": 3.0,
     "ebitdaPct": 3.8,
     "pbr": 1.44
    }
   },
   "2028": {
    "bear": {
     "crude": 8.77,
     "crudeGrowthPct": 0.9,
     "pi80": {
      "crude": [
       6.65,
       11.55
      ],
      "opIncomeUsdMn": [
       -465.3,
       -175.1
      ],
      "ebitdaPct": [
       -6.7,
       0.9
      ],
      "pbr": [
       1.06,
       1.78
      ]
     },
     "opIncomeUsdMn": -320.2,
     "opMarginPct": -6.8,
     "ebitdaPct": -2.9,
     "pbr": 1.42
    },
    "base": {
     "crude": 8.87,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       6.73,
       11.69
      ],
      "opIncomeUsdMn": [
       -237.9,
       55.8
      ],
      "ebitdaPct": [
       -3.4,
       4.2
      ],
      "pbr": [
       1.07,
       1.79
      ]
     },
     "opIncomeUsdMn": -91.0,
     "opMarginPct": -1.9,
     "ebitdaPct": 0.4,
     "pbr": 1.43
    },
    "bull": {
     "crude": 8.98,
     "crudeGrowthPct": 1.9,
     "pi80": {
      "crude": [
       6.82,
       11.84
      ],
      "opIncomeUsdMn": [
       -4.9,
       292.5
      ],
      "ebitdaPct": [
       -0.0,
       7.5
      ],
      "pbr": [
       1.08,
       1.8
      ]
     },
     "opIncomeUsdMn": 143.8,
     "opMarginPct": 3.0,
     "ebitdaPct": 3.8,
     "pbr": 1.44
    }
   }
  },
  "evraz": {
   "2026": {
    "bear": {
     "crude": 8.47,
     "crudeGrowthPct": 1.0,
     "pi80": {
      "crude": [
       7.22,
       9.93
      ]
     }
    },
    "base": {
     "crude": 8.5,
     "crudeGrowthPct": 1.4,
     "pi80": {
      "crude": [
       7.25,
       9.97
      ]
     }
    },
    "bull": {
     "crude": 8.53,
     "crudeGrowthPct": 1.8,
     "pi80": {
      "crude": [
       7.27,
       10.0
      ]
     }
    }
   },
   "2027": {
    "bear": {
     "crude": 8.53,
     "crudeGrowthPct": 0.8,
     "pi80": {
      "crude": [
       6.81,
       10.69
      ]
     }
    },
    "base": {
     "crude": 8.63,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       6.89,
       10.81
      ]
     }
    },
    "bull": {
     "crude": 8.73,
     "crudeGrowthPct": 2.3,
     "pi80": {
      "crude": [
       6.97,
       10.93
      ]
     }
    }
   },
   "2028": {
    "bear": {
     "crude": 8.6,
     "crudeGrowthPct": 0.8,
     "pi80": {
      "crude": [
       6.52,
       11.33
      ]
     }
    },
    "base": {
     "crude": 8.76,
     "crudeGrowthPct": 1.5,
     "pi80": {
      "crude": [
       6.65,
       11.54
      ]
     }
    },
    "bull": {
     "crude": 8.93,
     "crudeGrowthPct": 2.3,
     "pi80": {
      "crude": [
       6.77,
       11.76
      ]
     }
    }
   }
  }
 }
};
