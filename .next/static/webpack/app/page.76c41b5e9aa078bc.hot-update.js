"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/page",{

/***/ "(app-pages-browser)/./src/app/styles/MobileNavigation.styles.ts":
/*!***************************************************!*\
  !*** ./src/app/styles/MobileNavigation.styles.ts ***!
  \***************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AllBlur: function() { return /* binding */ AllBlur; },\n/* harmony export */   AllFilmsIcon: function() { return /* binding */ AllFilmsIcon; },\n/* harmony export */   HomeIcon: function() { return /* binding */ HomeIcon; },\n/* harmony export */   NavigationContainer: function() { return /* binding */ NavigationContainer; },\n/* harmony export */   NavigationItem: function() { return /* binding */ NavigationItem; },\n/* harmony export */   SearchIcon: function() { return /* binding */ SearchIcon; },\n/* harmony export */   StyledLink: function() { return /* binding */ StyledLink; }\n/* harmony export */ });\n/* harmony import */ var _swc_helpers_tagged_template_literal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @swc/helpers/_/_tagged_template_literal */ \"(app-pages-browser)/./node_modules/@swc/helpers/esm/_tagged_template_literal.js\");\n/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! styled-components */ \"(app-pages-browser)/./node_modules/styled-components/dist/styled-components.browser.esm.js\");\n/* harmony import */ var _public_assets_icons_home_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../public/assets/icons/home.svg */ \"(app-pages-browser)/./public/assets/icons/home.svg\");\n/* harmony import */ var _public_assets_icons_search_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../public/assets/icons/search.svg */ \"(app-pages-browser)/./public/assets/icons/search.svg\");\n/* harmony import */ var _components_MobileNavigation_AllFilmsIcon_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/MobileNavigation/AllFilmsIcon.svg */ \"(app-pages-browser)/./src/components/MobileNavigation/AllFilmsIcon.svg\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/link */ \"(app-pages-browser)/./node_modules/next/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_4__);\n\nfunction _templateObject() {\n    const data = (0,_swc_helpers_tagged_template_literal__WEBPACK_IMPORTED_MODULE_0__._)([\n        \"\\n  display: flex;\\n  flex-direction: column;\\n  align-items: center;\\n  color: \",\n        \";\\n\\n  i {\\n    font-size: 24px;\\n  }\\n\\n  span {\\n    font-size: 12px;\\n    font-weight: 600;\\n    color: \",\n        \";\\n  }\\n\\n  &:hover {\\n    cursor: pointer;\\n  }\\n\"\n    ]);\n    _templateObject = function() {\n        return data;\n    };\n    return data;\n}\nfunction _templateObject1() {\n    const data = (0,_swc_helpers_tagged_template_literal__WEBPACK_IMPORTED_MODULE_0__._)([\n        \"\\n  display: none;\\n  justify-content: space-around;\\n  align-items: center;\\n  position: fixed;\\n  bottom: -3px;\\n  left: -2px;\\n  width: 100%;\\n  height: 65px;\\n  background-color: #181818;\\n  -webkit-backdrop-filter: blur(6px);\\n  backdrop-filter: blur(6px);\\n  background: rgb(0 0 0 / 83%);\\n  --safe-area-inset-bottom: env(safe-area-inset-bottom);\\n  padding: 40px 0 calc( 35px + env(safe-area-inset-bottom) );\\n  padding-left: 0px;\\n  z-index: 20;\\n  @media (max-width: 850px){\\n  display: flex;\\n  }\\n\"\n    ]);\n    _templateObject1 = function() {\n        return data;\n    };\n    return data;\n}\nfunction _templateObject2() {\n    const data = (0,_swc_helpers_tagged_template_literal__WEBPACK_IMPORTED_MODULE_0__._)([\n        \"\\n  width: 25px;\\n  height: 25px;\\n  margin-bottom: 5px;\\n  stroke: \",\n        \";\\n  fill: none;\\n\"\n    ]);\n    _templateObject2 = function() {\n        return data;\n    };\n    return data;\n}\nfunction _templateObject3() {\n    const data = (0,_swc_helpers_tagged_template_literal__WEBPACK_IMPORTED_MODULE_0__._)([\n        \"\\n  width: 25px;\\n  height: 25px;\\n  margin-bottom: 5px;\\n\"\n    ]);\n    _templateObject3 = function() {\n        return data;\n    };\n    return data;\n}\nfunction _templateObject4() {\n    const data = (0,_swc_helpers_tagged_template_literal__WEBPACK_IMPORTED_MODULE_0__._)([\n        \"\\n  width: 25px;\\n  height: 25px;\\n  margin-bottom: 5px;\\n  stroke: \",\n        \";\\n  stroke-width: 0.5px;\\n\"\n    ]);\n    _templateObject4 = function() {\n        return data;\n    };\n    return data;\n}\nfunction _templateObject5() {\n    const data = (0,_swc_helpers_tagged_template_literal__WEBPACK_IMPORTED_MODULE_0__._)([\n        \"\\n  display: flex;\\n  flex-direction: column;\\n  align-items: center;\\n  width: 100%;\\n  text-decoration: none;\\n\"\n    ]);\n    _templateObject5 = function() {\n        return data;\n    };\n    return data;\n}\nfunction _templateObject6() {\n    const data = (0,_swc_helpers_tagged_template_literal__WEBPACK_IMPORTED_MODULE_0__._)([\n        \"\\n  position: fixed;\\n  z-index: 5;\\n  top: -100vh;\\n  left: 0;\\n  width: 100%;\\n  height: 100vh;\\n  background-color: rgb(0 0 0 / 80%);\\n\"\n    ]);\n    _templateObject6 = function() {\n        return data;\n    };\n    return data;\n}\n\n\n\n\n\nconst NavigationItem = styled_components__WEBPACK_IMPORTED_MODULE_5__[\"default\"].div.withConfig({\n    displayName: \"MobileNavigation.styles__NavigationItem\",\n    componentId: \"sc-8a9f6884-0\"\n})(_templateObject(), (param)=>{\n    let { active } = param;\n    return +active ? \"#fff\" : \"#b3b3b3\";\n}, (param)=>{\n    let { active } = param;\n    return +active ? \"#fff\" : \"#b3b3b3\";\n});\nconst NavigationContainer = styled_components__WEBPACK_IMPORTED_MODULE_5__[\"default\"].div.withConfig({\n    displayName: \"MobileNavigation.styles__NavigationContainer\",\n    componentId: \"sc-8a9f6884-1\"\n})(_templateObject1());\nconst HomeIcon = (0,styled_components__WEBPACK_IMPORTED_MODULE_5__[\"default\"])(_public_assets_icons_home_svg__WEBPACK_IMPORTED_MODULE_1__[\"default\"]).withConfig({\n    displayName: \"MobileNavigation.styles__HomeIcon\",\n    componentId: \"sc-8a9f6884-2\"\n})(_templateObject2(), (param)=>{\n    let { active } = param;\n    return +active ? \"#fff\" : \"#b3b3b3\";\n});\nconst SearchIcon = (0,styled_components__WEBPACK_IMPORTED_MODULE_5__[\"default\"])(_public_assets_icons_search_svg__WEBPACK_IMPORTED_MODULE_2__[\"default\"]).withConfig({\n    displayName: \"MobileNavigation.styles__SearchIcon\",\n    componentId: \"sc-8a9f6884-3\"\n})(_templateObject3());\nconst AllFilmsIcon = (0,styled_components__WEBPACK_IMPORTED_MODULE_5__[\"default\"])(_components_MobileNavigation_AllFilmsIcon_svg__WEBPACK_IMPORTED_MODULE_3__[\"default\"]).withConfig({\n    displayName: \"MobileNavigation.styles__AllFilmsIcon\",\n    componentId: \"sc-8a9f6884-4\"\n})(_templateObject4(), (param)=>{\n    let { active } = param;\n    return +active ? \"#fff\" : \"#b3b3b3\";\n});\nconst StyledLink = (0,styled_components__WEBPACK_IMPORTED_MODULE_5__[\"default\"])((next_link__WEBPACK_IMPORTED_MODULE_4___default())).withConfig({\n    displayName: \"MobileNavigation.styles__StyledLink\",\n    componentId: \"sc-8a9f6884-5\"\n})(_templateObject5());\nconst AllBlur = styled_components__WEBPACK_IMPORTED_MODULE_5__[\"default\"].div.withConfig({\n    displayName: \"MobileNavigation.styles__AllBlur\",\n    componentId: \"sc-8a9f6884-6\"\n})(_templateObject6());\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvc3R5bGVzL01vYmlsZU5hdmlnYXRpb24uc3R5bGVzLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBc0M7QUFFc0I7QUFDSztBQUNhO0FBQ2pEO0FBRXRCLE1BQU1LLGlCQUFpQkwseURBQU1BLENBQUNNLEdBQUc7OztzQkFJN0I7UUFBQyxFQUFDQyxNQUFNLEVBQUM7V0FBTSxDQUFFQSxTQUFVLFNBQVM7QUFBUSxHQVMxQztRQUFDLEVBQUNBLE1BQU0sRUFBQztXQUFNLENBQUVBLFNBQVUsU0FBUztBQUFRLEdBTXZEO0FBRUssTUFBTUMsc0JBQXNCUix5REFBTUEsQ0FBQ00sR0FBRzs7O3VCQW9CM0M7QUFFSyxNQUFNRyxXQUFXVCw2REFBTUEsQ0FBQ0MscUVBQVFBOzs7dUJBSTNCO1FBQUMsRUFBQ00sTUFBTSxFQUFDO1dBQU0sQ0FBRUEsU0FBVSxTQUFTO0FBQVEsR0FFdkQ7QUFFTSxNQUFNRyxhQUFhViw2REFBTUEsQ0FBQ0UsdUVBQVVBOzs7dUJBSTFDO0FBQ00sTUFBTVMsZUFBZVgsNkRBQU1BLENBQUNHLHFGQUFZQTs7O3VCQUluQztRQUFDLEVBQUNJLE1BQU0sRUFBQztXQUFNLENBQUVBLFNBQVUsU0FBUztBQUFRLEdBRXZEO0FBQ00sTUFBTUssYUFBYVosNkRBQU1BLENBQUNJLGtEQUFJQTs7O3VCQU1uQztBQUVLLE1BQU1TLFVBQVViLHlEQUFNQSxDQUFDTSxHQUFHOzs7dUJBUS9CIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy9hcHAvc3R5bGVzL01vYmlsZU5hdmlnYXRpb24uc3R5bGVzLnRzP2EwOTkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cydcbmltcG9ydCB7IE5hdmlnYXRpb25JdGVtUHJvcHMgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL01vYmlsZU5hdmlnYXRpb24vTW9iaWxlTmF2aWdhdGlvbi50eXBlcyc7XG5pbXBvcnQgSG9tZWljb24gZnJvbSAnLi4vLi4vLi4vcHVibGljL2Fzc2V0cy9pY29ucy9ob21lLnN2ZydcbmltcG9ydCBTZWFyY2hpY29uICBmcm9tICcuLi8uLi8uLi9wdWJsaWMvYXNzZXRzL2ljb25zL3NlYXJjaC5zdmcnXG5pbXBvcnQgIEFsbGZpbG1zaWNvbiBmcm9tICcuLi8uLi9jb21wb25lbnRzL01vYmlsZU5hdmlnYXRpb24vQWxsRmlsbXNJY29uLnN2ZydcbmltcG9ydCBMaW5rIGZyb20gJ25leHQvbGluayc7XG5cbmV4cG9ydCBjb25zdCBOYXZpZ2F0aW9uSXRlbSA9IHN0eWxlZC5kaXY8TmF2aWdhdGlvbkl0ZW1Qcm9wcz5gXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGNvbG9yOiAkeyh7YWN0aXZlfSkgPT4gKCgrYWN0aXZlKSA/ICcjZmZmJyA6ICcjYjNiM2IzJyl9O1xuXG4gIGkge1xuICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgfVxuXG4gIHNwYW4ge1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGNvbG9yOiAkeyh7YWN0aXZlfSkgPT4gKCgrYWN0aXZlKSA/ICcjZmZmJyA6ICcjYjNiM2IzJyl9O1xuICB9XG5cbiAgJjpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgTmF2aWdhdGlvbkNvbnRhaW5lciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IG5vbmU7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIGJvdHRvbTogLTNweDtcbiAgbGVmdDogLTJweDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogNjVweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzE4MTgxODtcbiAgLXdlYmtpdC1iYWNrZHJvcC1maWx0ZXI6IGJsdXIoNnB4KTtcbiAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDZweCk7XG4gIGJhY2tncm91bmQ6IHJnYigwIDAgMCAvIDgzJSk7XG4gIC0tc2FmZS1hcmVhLWluc2V0LWJvdHRvbTogZW52KHNhZmUtYXJlYS1pbnNldC1ib3R0b20pO1xuICBwYWRkaW5nOiA0MHB4IDAgY2FsYyggMzVweCArIGVudihzYWZlLWFyZWEtaW5zZXQtYm90dG9tKSApO1xuICBwYWRkaW5nLWxlZnQ6IDBweDtcbiAgei1pbmRleDogMjA7XG4gIEBtZWRpYSAobWF4LXdpZHRoOiA4NTBweCl7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBIb21lSWNvbiA9IHN0eWxlZChIb21laWNvbik8TmF2aWdhdGlvbkl0ZW1Qcm9wcz5gXG4gIHdpZHRoOiAyNXB4O1xuICBoZWlnaHQ6IDI1cHg7XG4gIG1hcmdpbi1ib3R0b206IDVweDtcbiAgc3Ryb2tlOiAkeyh7YWN0aXZlfSkgPT4gKCgrYWN0aXZlKSA/ICcjZmZmJyA6ICcjYjNiM2IzJyl9O1xuICBmaWxsOiBub25lO1xuYFxuXG5leHBvcnQgY29uc3QgU2VhcmNoSWNvbiA9IHN0eWxlZChTZWFyY2hpY29uKWBcbiAgd2lkdGg6IDI1cHg7XG4gIGhlaWdodDogMjVweDtcbiAgbWFyZ2luLWJvdHRvbTogNXB4O1xuYFxuZXhwb3J0IGNvbnN0IEFsbEZpbG1zSWNvbiA9IHN0eWxlZChBbGxmaWxtc2ljb24pPE5hdmlnYXRpb25JdGVtUHJvcHM+YFxuICB3aWR0aDogMjVweDtcbiAgaGVpZ2h0OiAyNXB4O1xuICBtYXJnaW4tYm90dG9tOiA1cHg7XG4gIHN0cm9rZTogJHsoe2FjdGl2ZX0pID0+ICgoK2FjdGl2ZSkgPyAnI2ZmZicgOiAnI2IzYjNiMycpfTtcbiAgc3Ryb2tlLXdpZHRoOiAwLjVweDtcbmBcbmV4cG9ydCBjb25zdCBTdHlsZWRMaW5rID0gc3R5bGVkKExpbmspYFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB3aWR0aDogMTAwJTtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuYDtcblxuZXhwb3J0IGNvbnN0IEFsbEJsdXIgPSBzdHlsZWQuZGl2YFxuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHotaW5kZXg6IDU7XG4gIHRvcDogLTEwMHZoO1xuICBsZWZ0OiAwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDAgMCAwIC8gODAlKTtcbmA7Il0sIm5hbWVzIjpbInN0eWxlZCIsIkhvbWVpY29uIiwiU2VhcmNoaWNvbiIsIkFsbGZpbG1zaWNvbiIsIkxpbmsiLCJOYXZpZ2F0aW9uSXRlbSIsImRpdiIsImFjdGl2ZSIsIk5hdmlnYXRpb25Db250YWluZXIiLCJIb21lSWNvbiIsIlNlYXJjaEljb24iLCJBbGxGaWxtc0ljb24iLCJTdHlsZWRMaW5rIiwiQWxsQmx1ciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/styles/MobileNavigation.styles.ts\n"));

/***/ })

});