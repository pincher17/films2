"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/(wrap)/layout",{

/***/ "(app-pages-browser)/./src/components/MobileNavigation/MobileNavigation.tsx":
/*!**************************************************************!*\
  !*** ./src/components/MobileNavigation/MobileNavigation.tsx ***!
  \**************************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var _app_styles_MobileNavigation_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../app/styles/MobileNavigation.styles */ \"(app-pages-browser)/./src/app/styles/MobileNavigation.styles.ts\");\n/* harmony import */ var _redux_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/redux/hooks */ \"(app-pages-browser)/./src/redux/hooks.ts\");\n/* harmony import */ var _redux_searchSlice__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/redux/searchSlice */ \"(app-pages-browser)/./src/redux/searchSlice.ts\");\n/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/navigation */ \"(app-pages-browser)/./node_modules/next/navigation.js\");\n/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_4__);\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n\n\nconst MobileNavigation = ()=>{\n    _s();\n    const mobileSearch = (0,_redux_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)((state)=>state.search.mobileSearch);\n    const dispatch = (0,_redux_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppDispatch)();\n    const pathname = (0,next_navigation__WEBPACK_IMPORTED_MODULE_4__.usePathname)();\n    const switchMobileSearch = (value)=>dispatch((0,_redux_searchSlice__WEBPACK_IMPORTED_MODULE_3__.setMobileSearch)(value));\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_app_styles_MobileNavigation_styles__WEBPACK_IMPORTED_MODULE_1__.NavigationContainer, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_app_styles_MobileNavigation_styles__WEBPACK_IMPORTED_MODULE_1__.NavigationItem, {\n                $active: +(pathname === \"/\"),\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_app_styles_MobileNavigation_styles__WEBPACK_IMPORTED_MODULE_1__.StyledLink, {\n                    href: \"/\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_app_styles_MobileNavigation_styles__WEBPACK_IMPORTED_MODULE_1__.HomeIcon, {\n                            active: +(pathname === \"/\")\n                        }, void 0, false, {\n                            fileName: \"/Users/andrei/Git/films2/src/components/MobileNavigation/MobileNavigation.tsx\",\n                            lineNumber: 18,\n                            columnNumber: 9\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                            children: \"Главная\"\n                        }, void 0, false, {\n                            fileName: \"/Users/andrei/Git/films2/src/components/MobileNavigation/MobileNavigation.tsx\",\n                            lineNumber: 19,\n                            columnNumber: 9\n                        }, undefined)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/andrei/Git/films2/src/components/MobileNavigation/MobileNavigation.tsx\",\n                    lineNumber: 17,\n                    columnNumber: 9\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"/Users/andrei/Git/films2/src/components/MobileNavigation/MobileNavigation.tsx\",\n                lineNumber: 16,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_app_styles_MobileNavigation_styles__WEBPACK_IMPORTED_MODULE_1__.NavigationItem, {\n                $active: +(pathname === \"/films\"),\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_app_styles_MobileNavigation_styles__WEBPACK_IMPORTED_MODULE_1__.StyledLink, {\n                    href: \"/films\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_app_styles_MobileNavigation_styles__WEBPACK_IMPORTED_MODULE_1__.AllFilmsIcon, {\n                            active: +(pathname === \"/films\")\n                        }, void 0, false, {\n                            fileName: \"/Users/andrei/Git/films2/src/components/MobileNavigation/MobileNavigation.tsx\",\n                            lineNumber: 24,\n                            columnNumber: 9\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                            children: \"Все фильмы\"\n                        }, void 0, false, {\n                            fileName: \"/Users/andrei/Git/films2/src/components/MobileNavigation/MobileNavigation.tsx\",\n                            lineNumber: 25,\n                            columnNumber: 9\n                        }, undefined)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/andrei/Git/films2/src/components/MobileNavigation/MobileNavigation.tsx\",\n                    lineNumber: 23,\n                    columnNumber: 9\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"/Users/andrei/Git/films2/src/components/MobileNavigation/MobileNavigation.tsx\",\n                lineNumber: 22,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_app_styles_MobileNavigation_styles__WEBPACK_IMPORTED_MODULE_1__.NavigationItem, {\n                $active: +mobileSearch,\n                onClick: ()=>switchMobileSearch(true),\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_app_styles_MobileNavigation_styles__WEBPACK_IMPORTED_MODULE_1__.SearchIcon, {}, void 0, false, {\n                        fileName: \"/Users/andrei/Git/films2/src/components/MobileNavigation/MobileNavigation.tsx\",\n                        lineNumber: 32,\n                        columnNumber: 9\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                        children: \"Поиск\"\n                    }, void 0, false, {\n                        fileName: \"/Users/andrei/Git/films2/src/components/MobileNavigation/MobileNavigation.tsx\",\n                        lineNumber: 33,\n                        columnNumber: 9\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/andrei/Git/films2/src/components/MobileNavigation/MobileNavigation.tsx\",\n                lineNumber: 28,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/andrei/Git/films2/src/components/MobileNavigation/MobileNavigation.tsx\",\n        lineNumber: 15,\n        columnNumber: 5\n    }, undefined);\n};\n_s(MobileNavigation, \"TOLqH86dePBAsT2B66L6Eo51Kpo=\", false, function() {\n    return [\n        _redux_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector,\n        _redux_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppDispatch,\n        next_navigation__WEBPACK_IMPORTED_MODULE_4__.usePathname\n    ];\n});\n_c = MobileNavigation;\n/* harmony default export */ __webpack_exports__[\"default\"] = (MobileNavigation);\nvar _c;\n$RefreshReg$(_c, \"MobileNavigation\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9jb21wb25lbnRzL01vYmlsZU5hdmlnYXRpb24vTW9iaWxlTmF2aWdhdGlvbi50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRStJO0FBQ2hGO0FBQ1Q7QUFDUjtBQUU5QyxNQUFNVSxtQkFBbUI7O0lBQ3ZCLE1BQU1DLGVBQWVKLDREQUFjQSxDQUFDSyxDQUFBQSxRQUFTQSxNQUFNQyxNQUFNLENBQUNGLFlBQVk7SUFDdEUsTUFBTUcsV0FBV1IsNERBQWNBO0lBQy9CLE1BQU1TLFdBQVdOLDREQUFXQTtJQUM1QixNQUFNTyxxQkFBcUIsQ0FBQ0MsUUFBbUJILFNBQVNOLG1FQUFlQSxDQUFDUztJQUV4RSxxQkFDRSw4REFBQ2Ysb0ZBQW1CQTs7MEJBQ2xCLDhEQUFDQywrRUFBY0E7Z0JBQUNlLFNBQVUsQ0FBRUgsQ0FBQUEsYUFBYSxHQUFFOzBCQUN6Qyw0RUFBQ1YsMkVBQVVBO29CQUFDYyxNQUFLOztzQ0FDakIsOERBQUNsQix5RUFBUUE7NEJBQUNtQixRQUFTLENBQUVMLENBQUFBLGFBQWEsR0FBRTs7Ozs7O3NDQUNwQyw4REFBQ007c0NBQUs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBCQUdSLDhEQUFDbEIsK0VBQWNBO2dCQUFDZSxTQUFVLENBQUVILENBQUFBLGFBQWEsUUFBTzswQkFDOUMsNEVBQUNWLDJFQUFVQTtvQkFBQ2MsTUFBSzs7c0NBQ2pCLDhEQUFDbkIsNkVBQVlBOzRCQUFDb0IsUUFBUyxDQUFFTCxDQUFBQSxhQUFhLFFBQU87Ozs7OztzQ0FDN0MsOERBQUNNO3NDQUFLOzs7Ozs7Ozs7Ozs7Ozs7OzswQkFHUiw4REFBQ2xCLCtFQUFjQTtnQkFDYmUsU0FBVSxDQUFDUDtnQkFDWFcsU0FBUyxJQUFNTixtQkFBbUI7O2tDQUVsQyw4REFBQ1osMkVBQVVBOzs7OztrQ0FDWCw4REFBQ2lCO2tDQUFLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJZDtHQTdCTVg7O1FBQ2lCSCx3REFBY0E7UUFDbEJELHdEQUFjQTtRQUNkRyx3REFBV0E7OztLQUh4QkM7QUErQk4sK0RBQWVBLGdCQUFnQkEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9zcmMvY29tcG9uZW50cy9Nb2JpbGVOYXZpZ2F0aW9uL01vYmlsZU5hdmlnYXRpb24udHN4P2U3YjQiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5cbmltcG9ydCB7IEFsbEZpbG1zSWNvbiwgSG9tZUljb24sIE5hdmlnYXRpb25Db250YWluZXIsIE5hdmlnYXRpb25JdGVtLCBTZWFyY2hJY29uLCBTdHlsZWRMaW5rIH0gZnJvbSAnLi4vLi4vYXBwL3N0eWxlcy9Nb2JpbGVOYXZpZ2F0aW9uLnN0eWxlcyc7XG5pbXBvcnQgeyB1c2VBcHBEaXNwYXRjaCwgdXNlQXBwU2VsZWN0b3IgfSBmcm9tICdAL3JlZHV4L2hvb2tzJztcbmltcG9ydCB7IHNldE1vYmlsZVNlYXJjaCB9IGZyb20gJ0AvcmVkdXgvc2VhcmNoU2xpY2UnO1xuaW1wb3J0IHsgdXNlUGF0aG5hbWUgfSBmcm9tICduZXh0L25hdmlnYXRpb24nO1xuXG5jb25zdCBNb2JpbGVOYXZpZ2F0aW9uID0gKCkgPT4ge1xuICBjb25zdCBtb2JpbGVTZWFyY2ggPSB1c2VBcHBTZWxlY3RvcihzdGF0ZSA9PiBzdGF0ZS5zZWFyY2gubW9iaWxlU2VhcmNoKTtcbiAgY29uc3QgZGlzcGF0Y2ggPSB1c2VBcHBEaXNwYXRjaCgpXG4gIGNvbnN0IHBhdGhuYW1lID0gdXNlUGF0aG5hbWUoKVxuICBjb25zdCBzd2l0Y2hNb2JpbGVTZWFyY2ggPSAodmFsdWU6IGJvb2xlYW4pID0+IGRpc3BhdGNoKHNldE1vYmlsZVNlYXJjaCh2YWx1ZSkpXG5cbiAgcmV0dXJuIChcbiAgICA8TmF2aWdhdGlvbkNvbnRhaW5lcj5cbiAgICAgIDxOYXZpZ2F0aW9uSXRlbSAkYWN0aXZlPXsoKyhwYXRobmFtZSA9PT0gJy8nKSl9PlxuICAgICAgICA8U3R5bGVkTGluayBocmVmPVwiL1wiPlxuICAgICAgICA8SG9tZUljb24gYWN0aXZlPXsoKyhwYXRobmFtZSA9PT0gJy8nKSl9IC8+XG4gICAgICAgIDxzcGFuPtCT0LvQsNCy0L3QsNGPPC9zcGFuPlxuICAgICAgICA8L1N0eWxlZExpbms+XG4gICAgICA8L05hdmlnYXRpb25JdGVtPlxuICAgICAgPE5hdmlnYXRpb25JdGVtICRhY3RpdmU9eygrKHBhdGhuYW1lID09PSAnL2ZpbG1zJykpfT5cbiAgICAgICAgPFN0eWxlZExpbmsgaHJlZj1cIi9maWxtc1wiPlxuICAgICAgICA8QWxsRmlsbXNJY29uIGFjdGl2ZT17KCsocGF0aG5hbWUgPT09ICcvZmlsbXMnKSl9IC8+XG4gICAgICAgIDxzcGFuPtCS0YHQtSDRhNC40LvRjNC80Ys8L3NwYW4+XG4gICAgICAgIDwvU3R5bGVkTGluaz5cbiAgICAgIDwvTmF2aWdhdGlvbkl0ZW0+XG4gICAgICA8TmF2aWdhdGlvbkl0ZW1cbiAgICAgICAgJGFjdGl2ZT17KCttb2JpbGVTZWFyY2gpfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBzd2l0Y2hNb2JpbGVTZWFyY2godHJ1ZSl9XG4gICAgICA+XG4gICAgICAgIDxTZWFyY2hJY29uIC8+XG4gICAgICAgIDxzcGFuPtCf0L7QuNGB0Lo8L3NwYW4+XG4gICAgICA8L05hdmlnYXRpb25JdGVtPlxuICAgIDwvTmF2aWdhdGlvbkNvbnRhaW5lcj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE1vYmlsZU5hdmlnYXRpb247XG4iXSwibmFtZXMiOlsiQWxsRmlsbXNJY29uIiwiSG9tZUljb24iLCJOYXZpZ2F0aW9uQ29udGFpbmVyIiwiTmF2aWdhdGlvbkl0ZW0iLCJTZWFyY2hJY29uIiwiU3R5bGVkTGluayIsInVzZUFwcERpc3BhdGNoIiwidXNlQXBwU2VsZWN0b3IiLCJzZXRNb2JpbGVTZWFyY2giLCJ1c2VQYXRobmFtZSIsIk1vYmlsZU5hdmlnYXRpb24iLCJtb2JpbGVTZWFyY2giLCJzdGF0ZSIsInNlYXJjaCIsImRpc3BhdGNoIiwicGF0aG5hbWUiLCJzd2l0Y2hNb2JpbGVTZWFyY2giLCJ2YWx1ZSIsIiRhY3RpdmUiLCJocmVmIiwiYWN0aXZlIiwic3BhbiIsIm9uQ2xpY2siXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/components/MobileNavigation/MobileNavigation.tsx\n"));

/***/ })

});