import { CollectionType } from '@/types/CollectionType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type initialStateType ={
    collections: Array<CollectionType>
}

const initialState: initialStateType ={
    collections: [   
        {
            "category": "Фильмы",
            "name": "250 лучших фильмов",
            "slug": "top250",
            "moviesCount": 250,
            "cover": {
              "url": "https://avatars.mds.yandex.net/get-bunker/56833/3ee361778f24483f04a6819bc6d84bcfba9030e4/orig",
              "previewUrl": "https://avatars.mds.yandex.net/get-bunker/56833/3ee361778f24483f04a6819bc6d84bcfba9030e4/x1000"
            },
            "createdAt": "2023-09-23T20:05:14.041Z",
            "updatedAt": "2023-09-23T20:05:14.041Z",
            "id": "650f44f99f5d4c5988ba913f"
          }, 
        {
        "category": "Сериалы",
        "name": "Популярные сериалы",
        "slug": "popular-series",
        "moviesCount": 1000,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/3e835b73-c62c-4ce5-974a-c9b6633ae183/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/3e835b73-c62c-4ce5-974a-c9b6633ae183/x1000"
        },
        "createdAt": "2023-09-23T20:06:07.212Z",
        "updatedAt": "2023-09-23T20:06:07.212Z",
        "id": "650f452f1ded07293423f155"
      },
      {
        "category": "Сериалы",
        "name": "100 великих сериалов XXI века",
        "slug": "100_greatest_TVseries",
        "moviesCount": 100,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-bunker/128809/42390deeca7c1c280f477a247083d9e8fcd6be2b/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-bunker/128809/42390deeca7c1c280f477a247083d9e8fcd6be2b/x1000"
        },
        "createdAt": "2023-09-23T20:06:07.212Z",
        "updatedAt": "2023-09-23T20:06:07.212Z",
        "id": "650f452f1ded07293423f153"
      },
      {
        "category": "Сериалы",
        "name": "Шедевры HBO",
        "slug": "hbo_best",
        "moviesCount": 30,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-kinopoisk-image/6201401/68c16b49-00f4-4a55-be44-da96924b80e6/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-kinopoisk-image/6201401/68c16b49-00f4-4a55-be44-da96924b80e6/x1000"
        },
        "createdAt": "2023-09-23T20:06:07.212Z",
        "updatedAt": "2023-09-23T20:06:07.212Z",
        "id": "650f452f1ded07293423f14f"
      },
      {
        "category": "Сериалы",
        "name": "250 лучших сериалов",
        "slug": "series-top250",
        "moviesCount": 250,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-bunker/118781/02f27f401e650b75c4d42ed9f15e999392d33615/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-bunker/118781/02f27f401e650b75c4d42ed9f15e999392d33615/x1000"
        },
        "createdAt": "2023-09-23T20:06:07.212Z",
        "updatedAt": "2023-09-23T20:06:07.212Z",
        "id": "650f452f1ded07293423f14d"
      },
      {
        "category": "Онлайн-кинотеатр",
        "name": "Озвучено студией «Кубик в кубе»",
        "slug": "ozvucheno_kubik_v_kube",
        "moviesCount": 124,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-bunker/56833/4a2969f3525706ce01799173e78f2716b0566b28/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-bunker/56833/4a2969f3525706ce01799173e78f2716b0566b28/x1000"
        },
        "createdAt": "2023-09-23T20:06:07.212Z",
        "updatedAt": "2023-09-23T20:06:07.212Z",
        "id": "650f452f1ded07293423f14b"
      },
      {
        "category": "Онлайн-кинотеатр",
        "name": "Киновселенная MARVEL",
        "slug": "marvel_universe",
        "moviesCount": 33,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-bunker/60661/3efd570507a11aeb81047fc198a61f423eda82c9/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-bunker/60661/3efd570507a11aeb81047fc198a61f423eda82c9/x1000"
        },
        "createdAt": "2023-09-23T20:06:07.212Z",
        "updatedAt": "2023-09-23T20:06:07.212Z",
        "id": "650f452f1ded07293423f149"
      },
      {
        "category": "Онлайн-кинотеатр",
        "name": "Фильмы, которые стоит посмотреть",
        "slug": "hd-must-see",
        "moviesCount": 75,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-bunker/50064/9a7c29bf643a8f27c2f95502bf604b1e2a3a8474/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-bunker/50064/9a7c29bf643a8f27c2f95502bf604b1e2a3a8474/x1000"
        },
        "createdAt": "2023-09-23T20:05:14.044Z",
        "updatedAt": "2023-09-23T20:05:14.044Z",
        "id": "650f44f99f5d4c5988ba9185"
      },
      {
        "category": "Онлайн-кинотеатр",
        "name": "Лучшие экранизации",
        "slug": "hd-adaptation",
        "moviesCount": 110,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-bunker/50064/6f34814c94c03c30e7835e361b75d2e4791245aa/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-bunker/50064/6f34814c94c03c30e7835e361b75d2e4791245aa/x1000"
        },
        "createdAt": "2023-09-23T20:05:14.044Z",
        "updatedAt": "2023-09-23T20:05:14.044Z",
        "id": "650f44f99f5d4c5988ba9181"
      },
      {
        "category": "Онлайн-кинотеатр",
        "name": "Фильмы по реальным событиям",
        "slug": "hd-real-story",
        "moviesCount": 40,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-bunker/56833/a6a749766d6e63b55a50f68a6059a0e8ae704b7e/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-bunker/56833/a6a749766d6e63b55a50f68a6059a0e8ae704b7e/x1000"
        },
        "createdAt": "2023-09-23T20:05:14.044Z",
        "updatedAt": "2023-09-23T20:05:14.044Z",
        "id": "650f44f99f5d4c5988ba917f"
      },
      {
        "category": "Фильмы",
        "name": "Фильмы 1941–1945: список лучших фильмов о Великой Отечественной войне ",
        "slug": "theme_ww2",
        "moviesCount": 203,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-bunker/128809/76695b64310edee921eb0172fba612a7fd9c3e31/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-bunker/128809/76695b64310edee921eb0172fba612a7fd9c3e31/x1000"
        },
        "createdAt": "2023-09-23T20:05:14.044Z",
        "updatedAt": "2023-09-23T20:05:14.044Z",
        "id": "650f44f99f5d4c5988ba916b"
      },
      {
        "category": "Фильмы",
        "name": "Лучшие фильмы про апокалипсис: список фильмов про конец света",
        "slug": "theme_worlds_end",
        "moviesCount": 50,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-bunker/120922/c4ac15668087ac8841cb2d2fa6f374fc8b0a4631/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-bunker/120922/c4ac15668087ac8841cb2d2fa6f374fc8b0a4631/x1000"
        },
        "createdAt": "2023-09-23T20:05:14.044Z",
        "updatedAt": "2023-09-23T20:05:14.044Z",
        "id": "650f44f99f5d4c5988ba9169"
      },
      {
        "category": "Фильмы",
        "name": "Лучшие фильмы, основанные на комиксах",
        "slug": "theme_comics",
        "moviesCount": 100,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-bunker/128809/f1918b49ff900cefd8533669933e158575d67974/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-bunker/128809/f1918b49ff900cefd8533669933e158575d67974/x1000"
        },
        "createdAt": "2023-09-23T20:05:14.044Z",
        "updatedAt": "2023-09-23T20:05:14.044Z",
        "id": "650f44f99f5d4c5988ba9167"
      },
      {
        "category": "Фильмы",
        "name": "Романтические комедии: список лучших смешных фильмов о любви",
        "slug": "theme_romantic_comedy",
        "moviesCount": 52,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-bunker/56833/309be4639dbb31e950e7ef5308ac8af8819b2ab2/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-bunker/56833/309be4639dbb31e950e7ef5308ac8af8819b2ab2/x1000"
        },
        "createdAt": "2023-09-23T20:05:14.043Z",
        "updatedAt": "2023-09-23T20:05:14.043Z",
        "id": "650f44f99f5d4c5988ba9163"
      },
      {
        "category": "Фильмы",
        "name": "Фильмы и сериалы про программистов",
        "slug": "about_programmers",
        "moviesCount": 46,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-bunker/135516/741df6d11c9f5b6f8cf76000621a810dfe2c555f/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-bunker/135516/741df6d11c9f5b6f8cf76000621a810dfe2c555f/x1000"
        },
        "createdAt": "2023-09-23T20:05:14.043Z",
        "updatedAt": "2023-09-23T20:05:14.043Z",
        "id": "650f44f99f5d4c5988ba915b"
      },
      {
        "category": "Фильмы",
        "name": "Фильмы про танцы",
        "slug": "theme_dance",
        "moviesCount": 31,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-bunker/128809/30bab0ab002d2cef39819d63bfc8baafb4a4e44f/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-bunker/128809/30bab0ab002d2cef39819d63bfc8baafb4a4e44f/x1000"
        },
        "createdAt": "2023-09-23T20:05:14.043Z",
        "updatedAt": "2023-09-23T20:05:14.043Z",
        "id": "650f44f99f5d4c5988ba9159"
      },
      {
        "category": "Фильмы",
        "name": "Фильмы-катастрофы",
        "slug": "theme_catastrophe",
        "moviesCount": 30,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-bunker/128809/1a7a6777dbcfca8c15f242a59e4604a925394b2f/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-bunker/128809/1a7a6777dbcfca8c15f242a59e4604a925394b2f/x1000"
        },
        "createdAt": "2023-09-23T20:05:14.043Z",
        "updatedAt": "2023-09-23T20:05:14.043Z",
        "id": "650f44f99f5d4c5988ba9153"
      },
      {
        "category": "Фильмы",
        "name": "Фильмы про космос: список лучших фильмов про космические путешествия",
        "slug": "theme_space",
        "moviesCount": 49,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-bunker/135516/86538e7380564fe83793a252172ad96f53160f9b/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-bunker/135516/86538e7380564fe83793a252172ad96f53160f9b/x1000"
        },
        "createdAt": "2023-09-23T20:05:14.042Z",
        "updatedAt": "2023-09-23T20:05:14.042Z",
        "id": "650f44f99f5d4c5988ba914f"
      },
      {
        "category": "Фильмы",
        "name": "Фильмы про зомби: список лучших фильмов про живых мертвецов ",
        "slug": "theme_zombie",
        "moviesCount": 31,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-bunker/61205/3a6f89842d075789f759e27d124e6dfaf4081f10/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-bunker/61205/3a6f89842d075789f759e27d124e6dfaf4081f10/x1000"
        },
        "createdAt": "2023-09-23T20:05:14.042Z",
        "updatedAt": "2023-09-23T20:05:14.042Z",
        "id": "650f44f99f5d4c5988ba914d"
      },
      {
        "category": "Фильмы",
        "name": "Фильмы про любовь и страсть: список лучших романтических фильмов ",
        "slug": "theme_love",
        "moviesCount": 70,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-bunker/49769/bc0d7724803fa746db20da65a7d3ca059ba91c29/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-bunker/49769/bc0d7724803fa746db20da65a7d3ca059ba91c29/x1000"
        },
        "createdAt": "2023-09-23T20:05:14.042Z",
        "updatedAt": "2023-09-23T20:05:14.042Z",
        "id": "650f44f99f5d4c5988ba914b"
      },
      {
        "category": "Фильмы",
        "name": "Фильмы про вампиров",
        "slug": "theme_vampire",
        "moviesCount": 30,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-bunker/56833/f038c5217f292a92a279afcebae05d198f35cdac/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-bunker/56833/f038c5217f292a92a279afcebae05d198f35cdac/x1000"
        },
        "createdAt": "2023-09-23T20:05:14.042Z",
        "updatedAt": "2023-09-23T20:05:14.042Z",
        "id": "650f44f99f5d4c5988ba9149"
      },
      {
        "category": "Фильмы",
        "name": "Популярные фильмы",
        "slug": "popular-films",
        "moviesCount": 1000,
        "cover": {
          "url": "https://avatars.mds.yandex.net/get-kinopoisk-image/1629390/5e785e92-af07-485c-b4b2-89b64b32c6d9/orig",
          "previewUrl": "https://avatars.mds.yandex.net/get-kinopoisk-image/1629390/5e785e92-af07-485c-b4b2-89b64b32c6d9/x1000"
        },
        "createdAt": "2023-09-23T20:05:14.042Z",
        "updatedAt": "2023-09-23T20:05:14.042Z",
        "id": "650f44f99f5d4c5988ba9145"
      },
    ],
}

const allCollections = createSlice({
    name: 'allCollections',
    initialState,
    reducers: {},
});



export default allCollections.reducer;