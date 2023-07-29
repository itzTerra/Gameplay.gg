<template>
    <button type="button" class="googleSignIn flex items-center">
        <svg class="hidden svg-normal" width="46px" height="46px" viewBox="0 0 46 46" version="1.1"
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
            <defs>
                <filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="filter-1">
                    <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                    <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.168 0" in="shadowBlurOuter1"
                        type="matrix" result="shadowMatrixOuter1"></feColorMatrix>
                    <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter2"></feOffset>
                    <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter2" result="shadowBlurOuter2"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.084 0" in="shadowBlurOuter2"
                        type="matrix" result="shadowMatrixOuter2"></feColorMatrix>
                    <feMerge>
                        <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
                        <feMergeNode in="shadowMatrixOuter2"></feMergeNode>
                        <feMergeNode in="SourceGraphic"></feMergeNode>
                    </feMerge>
                </filter>
                <rect id="path-2" x="0" y="0" width="40" height="40" rx="2"></rect>
            </defs>
            <g id="Google-Button" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                <g id="9-PATCH" sketch:type="MSArtboardGroup" transform="translate(-608.000000, -160.000000)"></g>
                <g id="btn_google_light_normal" sketch:type="MSArtboardGroup" transform="translate(-1.000000, -1.000000)">
                    <g id="button" sketch:type="MSLayerGroup" transform="translate(4.000000, 4.000000)"
                        filter="url(#filter-1)">
                        <g id="button-bg">
                            <use fill="#FFFFFF" fill-rule="evenodd" sketch:type="MSShapeGroup" xlink:href="#path-2"></use>
                            <use fill="none" xlink:href="#path-2"></use>
                            <use fill="none" xlink:href="#path-2"></use>
                            <use fill="none" xlink:href="#path-2"></use>
                        </g>
                    </g>
                    <g id="logo_googleg_48dp" sketch:type="MSLayerGroup" transform="translate(15.000000, 15.000000)">
                        <path
                            d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z"
                            id="Shape" fill="#4285F4" sketch:type="MSShapeGroup"></path>
                        <path
                            d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z"
                            id="Shape" fill="#34A853" sketch:type="MSShapeGroup"></path>
                        <path
                            d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z"
                            id="Shape" fill="#FBBC05" sketch:type="MSShapeGroup"></path>
                        <path
                            d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z"
                            id="Shape" fill="#EA4335" sketch:type="MSShapeGroup"></path>
                        <path d="M0,0 L18,0 L18,18 L0,18 L0,0 Z" id="Shape" sketch:type="MSShapeGroup"></path>
                    </g>
                    <g id="handles_square" sketch:type="MSLayerGroup"></g>
                </g>
            </g>
        </svg>
        <svg class="hidden svg-disabled" width="46px" height="46px" viewBox="0 0 46 46" version="1.1"
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
            <defs>
                <rect id="path-1" x="0" y="0" width="40" height="40" rx="2"></rect>
            </defs>
            <g id="Google-Button" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                <g id="9-PATCH" sketch:type="MSArtboardGroup" transform="translate(-788.000000, -160.000000)"></g>
                <g id="btn_google_light_disabled" sketch:type="MSArtboardGroup" transform="translate(-1.000000, -1.000000)">
                    <g id="button" sketch:type="MSLayerGroup" transform="translate(4.000000, 4.000000)">
                        <g id="button-bg">
                            <use fill-opacity="0.08" fill="#000000" fill-rule="evenodd" sketch:type="MSShapeGroup"
                                xlink:href="#path-1"></use>
                            <use fill="none" xlink:href="#path-1"></use>
                            <use fill="none" xlink:href="#path-1"></use>
                            <use fill="none" xlink:href="#path-1"></use>
                        </g>
                    </g>
                    <path
                        d="M24.001,25.71 L24.001,22.362 L32.425,22.362 C32.551,22.929 32.65,23.46 32.65,24.207 C32.65,29.346 29.203,33 24.01,33 C19.042,33 15.01,28.968 15.01,24 C15.01,19.032 19.042,15 24.01,15 C26.44,15 28.474,15.891 30.031,17.349 L27.475,19.833 C26.827,19.221 25.693,18.501 24.01,18.501 C21.031,18.501 18.601,20.976 18.601,24.009 C18.601,27.042 21.031,29.517 24.01,29.517 C27.457,29.517 28.726,27.132 28.96,25.719 L24.001,25.719 L24.001,25.71 Z"
                        id="Shape-Copy" fill-opacity="0.4" fill="#000000" sketch:type="MSShapeGroup"></path>
                    <g id="handles_square" sketch:type="MSLayerGroup"></g>
                </g>
            </g>
        </svg>
        <svg class="hidden svg-pressed" width="46px" height="46px" viewBox="0 0 46 46" version="1.1"
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
            <defs>
                <filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="filter-1">
                    <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                    <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.168 0" in="shadowBlurOuter1"
                        type="matrix" result="shadowMatrixOuter1"></feColorMatrix>
                    <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter2"></feOffset>
                    <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter2" result="shadowBlurOuter2"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.084 0" in="shadowBlurOuter2"
                        type="matrix" result="shadowMatrixOuter2"></feColorMatrix>
                    <feMerge>
                        <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
                        <feMergeNode in="shadowMatrixOuter2"></feMergeNode>
                        <feMergeNode in="SourceGraphic"></feMergeNode>
                    </feMerge>
                </filter>
                <rect id="path-2" x="0" y="0" width="40" height="40" rx="2"></rect>
                <rect id="path-3" x="5" y="5" width="38" height="38" rx="1"></rect>
            </defs>
            <g id="Google-Button" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                <g id="9-PATCH" sketch:type="MSArtboardGroup" transform="translate(-728.000000, -219.000000)"></g>
                <g id="btn_google_dark_pressed" sketch:type="MSArtboardGroup" transform="translate(-1.000000, -1.000000)">
                    <g id="button" sketch:type="MSLayerGroup" transform="translate(4.000000, 4.000000)"
                        filter="url(#filter-1)">
                        <g id="button-bg">
                            <use fill="#3367D6" fill-rule="evenodd" sketch:type="MSShapeGroup" xlink:href="#path-2"></use>
                            <use fill="none" xlink:href="#path-2"></use>
                            <use fill="none" xlink:href="#path-2"></use>
                            <use fill="none" xlink:href="#path-2"></use>
                        </g>
                    </g>
                    <g id="handles_square" sketch:type="MSLayerGroup"></g>
                    <g id="button-bg-copy">
                        <use fill="#EEEEEE" fill-rule="evenodd" sketch:type="MSShapeGroup" xlink:href="#path-3"></use>
                        <use fill="none" xlink:href="#path-3"></use>
                        <use fill="none" xlink:href="#path-3"></use>
                        <use fill="none" xlink:href="#path-3"></use>
                    </g>
                    <g id="logo_googleg_48dp" sketch:type="MSLayerGroup" transform="translate(15.000000, 15.000000)">
                        <path
                            d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z"
                            id="Shape" fill="#4285F4" sketch:type="MSShapeGroup"></path>
                        <path
                            d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z"
                            id="Shape" fill="#34A853" sketch:type="MSShapeGroup"></path>
                        <path
                            d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z"
                            id="Shape" fill="#FBBC05" sketch:type="MSShapeGroup"></path>
                        <path
                            d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z"
                            id="Shape" fill="#EA4335" sketch:type="MSShapeGroup"></path>
                        <path d="M0,0 L18,0 L18,18 L0,18 L0,0 Z" id="Shape" sketch:type="MSShapeGroup"></path>
                    </g>
                </g>
            </g>
        </svg>
        <svg class="hidden svg-focus" width="46px" height="46px" viewBox="0 0 46 46" version="1.1"
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
            <defs>
                <filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="filter-1">
                    <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                    <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.168 0" in="shadowBlurOuter1"
                        type="matrix" result="shadowMatrixOuter1"></feColorMatrix>
                    <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter2"></feOffset>
                    <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter2" result="shadowBlurOuter2"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.084 0" in="shadowBlurOuter2"
                        type="matrix" result="shadowMatrixOuter2"></feColorMatrix>
                    <feMerge>
                        <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
                        <feMergeNode in="shadowMatrixOuter2"></feMergeNode>
                        <feMergeNode in="SourceGraphic"></feMergeNode>
                    </feMerge>
                </filter>
                <rect id="path-2" x="0" y="0" width="40" height="40" rx="2"></rect>
                <rect id="path-3" x="5" y="5" width="38" height="38" rx="1"></rect>
            </defs>
            <g id="Google-Button" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                <g id="9-PATCH" sketch:type="MSArtboardGroup" transform="translate(-668.000000, -219.000000)"></g>
                <g id="btn_google_dark_focus" sketch:type="MSArtboardGroup" transform="translate(-1.000000, -1.000000)">
                    <rect id="Rectangle-14" fill-opacity="0.3" fill="#4285F4" sketch:type="MSShapeGroup" x="1" y="1"
                        width="46" height="46"></rect>
                    <g id="button" sketch:type="MSLayerGroup" transform="translate(4.000000, 4.000000)"
                        filter="url(#filter-1)">
                        <g id="button-bg">
                            <use fill="#4285F4" fill-rule="evenodd" sketch:type="MSShapeGroup" xlink:href="#path-2"></use>
                            <use fill="none" xlink:href="#path-2"></use>
                            <use fill="none" xlink:href="#path-2"></use>
                            <use fill="none" xlink:href="#path-2"></use>
                        </g>
                    </g>
                    <g id="button-bg-copy">
                        <use fill="#FFFFFF" fill-rule="evenodd" sketch:type="MSShapeGroup" xlink:href="#path-3"></use>
                        <use fill="none" xlink:href="#path-3"></use>
                        <use fill="none" xlink:href="#path-3"></use>
                        <use fill="none" xlink:href="#path-3"></use>
                    </g>
                    <g id="logo_googleg_48dp" sketch:type="MSLayerGroup" transform="translate(15.000000, 15.000000)">
                        <path
                            d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z"
                            id="Shape" fill="#4285F4" sketch:type="MSShapeGroup"></path>
                        <path
                            d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z"
                            id="Shape" fill="#34A853" sketch:type="MSShapeGroup"></path>
                        <path
                            d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z"
                            id="Shape" fill="#FBBC05" sketch:type="MSShapeGroup"></path>
                        <path
                            d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z"
                            id="Shape" fill="#EA4335" sketch:type="MSShapeGroup"></path>
                        <path d="M0,0 L18,0 L18,18 L0,18 L0,0 Z" id="Shape" sketch:type="MSShapeGroup"></path>
                    </g>
                    <g id="handles_square" sketch:type="MSLayerGroup"></g>
                </g>
            </g>
        </svg>
        <svg class="hidden svg-normal-light" width="46px" height="46px" viewBox="0 0 46 46" version="1.1"
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
            <defs>
                <filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="filter-1">
                    <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                    <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.168 0" in="shadowBlurOuter1"
                        type="matrix" result="shadowMatrixOuter1"></feColorMatrix>
                    <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter2"></feOffset>
                    <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter2" result="shadowBlurOuter2"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.084 0" in="shadowBlurOuter2"
                        type="matrix" result="shadowMatrixOuter2"></feColorMatrix>
                    <feMerge>
                        <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
                        <feMergeNode in="shadowMatrixOuter2"></feMergeNode>
                        <feMergeNode in="SourceGraphic"></feMergeNode>
                    </feMerge>
                </filter>
                <rect id="path-2" x="0" y="0" width="40" height="40" rx="2"></rect>
            </defs>
            <g id="Google-Button" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                <g id="9-PATCH" sketch:type="MSArtboardGroup" transform="translate(-608.000000, -160.000000)"></g>
                <g id="btn_google_light_normal" sketch:type="MSArtboardGroup" transform="translate(-1.000000, -1.000000)">
                    <g id="button" sketch:type="MSLayerGroup" transform="translate(4.000000, 4.000000)"
                        filter="url(#filter-1)">
                        <g id="button-bg">
                            <use fill="#FFFFFF" fill-rule="evenodd" sketch:type="MSShapeGroup" xlink:href="#path-2"></use>
                            <use fill="none" xlink:href="#path-2"></use>
                            <use fill="none" xlink:href="#path-2"></use>
                            <use fill="none" xlink:href="#path-2"></use>
                        </g>
                    </g>
                    <g id="logo_googleg_48dp" sketch:type="MSLayerGroup" transform="translate(15.000000, 15.000000)">
                        <path
                            d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z"
                            id="Shape" fill="#4285F4" sketch:type="MSShapeGroup"></path>
                        <path
                            d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z"
                            id="Shape" fill="#34A853" sketch:type="MSShapeGroup"></path>
                        <path
                            d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z"
                            id="Shape" fill="#FBBC05" sketch:type="MSShapeGroup"></path>
                        <path
                            d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z"
                            id="Shape" fill="#EA4335" sketch:type="MSShapeGroup"></path>
                        <path d="M0,0 L18,0 L18,18 L0,18 L0,0 Z" id="Shape" sketch:type="MSShapeGroup"></path>
                    </g>
                    <g id="handles_square" sketch:type="MSLayerGroup"></g>
                </g>
            </g>
        </svg>
        <svg class="hidden svg-focus-light" width="46px" height="46px" viewBox="0 0 46 46" version="1.1"
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
            <defs>
                <filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="filter-1">
                    <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                    <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.168 0" in="shadowBlurOuter1"
                        type="matrix" result="shadowMatrixOuter1"></feColorMatrix>
                    <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter2"></feOffset>
                    <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter2" result="shadowBlurOuter2"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.084 0" in="shadowBlurOuter2"
                        type="matrix" result="shadowMatrixOuter2"></feColorMatrix>
                    <feMerge>
                        <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
                        <feMergeNode in="shadowMatrixOuter2"></feMergeNode>
                        <feMergeNode in="SourceGraphic"></feMergeNode>
                    </feMerge>
                </filter>
                <rect id="path-2" x="0" y="0" width="40" height="40" rx="2"></rect>
            </defs>
            <g id="Google-Button" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                <g id="9-PATCH" sketch:type="MSArtboardGroup" transform="translate(-668.000000, -160.000000)"></g>
                <g id="btn_google_light_focus" sketch:type="MSArtboardGroup" transform="translate(-1.000000, -1.000000)">
                    <rect id="Rectangle-14" fill-opacity="0.3" fill="#4285F4" sketch:type="MSShapeGroup" x="1" y="1"
                        width="46" height="46"></rect>
                    <g id="button" sketch:type="MSLayerGroup" transform="translate(4.000000, 4.000000)"
                        filter="url(#filter-1)">
                        <g id="button-bg">
                            <use fill="#FFFFFF" fill-rule="evenodd" sketch:type="MSShapeGroup" xlink:href="#path-2"></use>
                            <use fill="none" xlink:href="#path-2"></use>
                            <use fill="none" xlink:href="#path-2"></use>
                            <use fill="none" xlink:href="#path-2"></use>
                        </g>
                    </g>
                    <g id="logo_googleg_48dp" sketch:type="MSLayerGroup" transform="translate(15.000000, 15.000000)">
                        <path
                            d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z"
                            id="Shape" fill="#4285F4" sketch:type="MSShapeGroup"></path>
                        <path
                            d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z"
                            id="Shape" fill="#34A853" sketch:type="MSShapeGroup"></path>
                        <path
                            d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z"
                            id="Shape" fill="#FBBC05" sketch:type="MSShapeGroup"></path>
                        <path
                            d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z"
                            id="Shape" fill="#EA4335" sketch:type="MSShapeGroup"></path>
                        <path d="M0,0 L18,0 L18,18 L0,18 L0,0 Z" id="Shape" sketch:type="MSShapeGroup"></path>
                    </g>
                    <g id="handles_square" sketch:type="MSLayerGroup"></g>
                </g>
            </g>
        </svg>
        <svg class="hidden svg-pressed-light" width="46px" height="46px" viewBox="0 0 46 46" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
            <defs>
                <filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="filter-1">
                    <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                    <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.168 0" in="shadowBlurOuter1"
                        type="matrix" result="shadowMatrixOuter1"></feColorMatrix>
                    <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter2"></feOffset>
                    <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter2" result="shadowBlurOuter2"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.084 0" in="shadowBlurOuter2"
                        type="matrix" result="shadowMatrixOuter2"></feColorMatrix>
                    <feMerge>
                        <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
                        <feMergeNode in="shadowMatrixOuter2"></feMergeNode>
                        <feMergeNode in="SourceGraphic"></feMergeNode>
                    </feMerge>
                </filter>
                <rect id="path-2" x="0" y="0" width="40" height="40" rx="2"></rect>
            </defs>
            <g id="Google-Button" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                <g id="9-PATCH" sketch:type="MSArtboardGroup" transform="translate(-728.000000, -160.000000)"></g>
                <g id="btn_google_light_pressed" sketch:type="MSArtboardGroup" transform="translate(-1.000000, -1.000000)">
                    <g id="button" sketch:type="MSLayerGroup" transform="translate(4.000000, 4.000000)"
                        filter="url(#filter-1)">
                        <g id="button-bg">
                            <use fill="#EEEEEE" fill-rule="evenodd" sketch:type="MSShapeGroup" xlink:href="#path-2"></use>
                            <use fill="none" xlink:href="#path-2"></use>
                            <use fill="none" xlink:href="#path-2"></use>
                            <use fill="none" xlink:href="#path-2"></use>
                        </g>
                    </g>
                    <g id="logo_googleg_48dp" sketch:type="MSLayerGroup" transform="translate(15.000000, 15.000000)">
                        <path
                            d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z"
                            id="Shape" fill="#4285F4" sketch:type="MSShapeGroup"></path>
                        <path
                            d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z"
                            id="Shape" fill="#34A853" sketch:type="MSShapeGroup"></path>
                        <path
                            d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z"
                            id="Shape" fill="#FBBC05" sketch:type="MSShapeGroup"></path>
                        <path
                            d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z"
                            id="Shape" fill="#EA4335" sketch:type="MSShapeGroup"></path>
                        <path d="M0,0 L18,0 L18,18 L0,18 L0,0 Z" id="Shape" sketch:type="MSShapeGroup"></path>
                    </g>
                    <g id="handles_square" sketch:type="MSLayerGroup"></g>
                </g>
            </g>
        </svg>
        <span class="googleSignIn__text">Sign in with Google</span>
    </button>
</template>
<style scoped>
.dark .googleSignIn {
    border: none;
    border-radius: 2px;
    background-color: #4285f4;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.24), 0 0 1px 0 rgba(0, 0, 0, 0.12);
    color: #FFF;
}

.dark .googleSignIn:hover {
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12);
}

.dark .googleSignIn:active:not(:disabled) {
    background: #3367D6;
}

.googleSignIn {
    border: none;
    border-radius: 2px;
    background-color: #FFF;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.24), 0 0 1px 0 rgba(0, 0, 0, 0.12);
    color: rgba(0, 0, 0, 0.54);
}

.googleSignIn:hover {
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12);
}

.googleSignIn:active:not(:disabled) {
    background: #EEEEEE;
}

.googleSignIn:disabled {
    background: #EBEBEB;
    color: #A5A5A5;
    box-shadow: none;
}

.googleSignIn__text {
    padding: 11px;
    font-family: "Roboto";
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.2px;
    text-align: left;
    white-space: nowrap;
}

button:disabled .svg-disabled {
    display: block;
}

.dark button:not(:disabled):not(:active):not(:focus-visible) .svg-normal {
    display: block;
}

.light button:not(:disabled):not(:active):not(:focus-visible) .svg-normal-light {
    display: block;
}

.dark button:active:not(:disabled) .svg-pressed {
    display: block;
}
.light button:active:not(:disabled) .svg-pressed-light {
    display: block;
}


.dark button:focus-visible .svg-focus {
    display: block;
}

.light button:focus-visible .svg-focus-light {
    display: block;
}</style>