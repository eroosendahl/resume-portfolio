// export const recipes = [
//     {
//         recipeId: 122,
//         categoryId: 3,
//         title: 'Oatmeal Cookies',
//         photo_url: 'https://www.texanerin.com/content/uploads/2019/06/nobake-chocolate-cookies-1-650x975.jpg',
//         photosArray: [
//             'https://www.texanerin.com/content/uploads/2019/06/nobake-chocolate-cookies-1-650x975.jpg',
//             "https://namelymarly.com/wp-content/uploads/2018/04/20180415_Beet_Lasagna_10.jpg",
//             'https://advancelocal-adapter-image-uploads.s3.amazonaws.com/image.al.com/home/bama-media/width600/img/news_impact/photo/burger-fijpg-57e7e5907630c2ad.jpg',
//             'https://img.thedailybeast.com/image/upload/c_crop,d_placeholder_euli9k,h_1439,w_2560,x_0,y_0/dpr_1.5/c_limit,w_1044/fl_lossy,q_auto/v1492718105/articles/2013/09/24/burger-king-s-new-french-fries-took-ten-years-to-develop/130923-gross-burger-tease_izz59e',
//             'https://aht.seriouseats.com/images/2012/02/20120221-193971-fast-food-fries-Burger-King-fries-2.jpg'
//         ],
//         time: '15',
//         ingredients: [[0, '200ml'], [1, '5g'], [2, '300g']],
//         description:
//             '-- Start with cleaned and peeled russet potatoes that you have cut into 3/8-inch match sticks. Place in bowl of very cold water: keep rinsing and changing the water until the water is clear; drain thoroughly and dry with paper towels or a clean lint-free kitchen towel.\n\n -- Meanwhile, you preheat your hot oil to 350 degrees F. Place prepared taters in oil and cook about 5 minutes. They will have that blond-tone color to them. \n\n -- Note: Once you add cold potatoes to the hot oil, the temperature of your oil is going to drop - you want it to be somewhere between 330 - 325 degrees F. \n\n -- Remove from oil; drain and cool. Now - either refrigerate until ready to finish cooking, or cool completely and freeze up to 3 months. To freeze properly - place completely cooled fries in single layer on tray and place in freezer until frozen. Then bag them.\n\n -- To finish cooking - preheat your oil to 400* F. Add your cold fries (which will drop the oil temp - which is fine because you want it near the 375 degrees F. temp) and cook a few minutes until done. Lightly salt them and shake well so that the salt distributes well and they are not salty.'
//     }];
// export const convertedDummyIngredients = [
//     {
//         id: 'i1',
//         title: 'Lettuce',
//         photo_url: 'https://source.unsplash.com/dS2hi__ZZMk/840x840',
//         price: 180,
//         store: "Store A"
//     },
//     {
//         id: 'i2',
//         title: 'Patty',
//         photo_url: 'https://source.unsplash.com/tb6ulgGY5Zc/840x840',
//         price: 220,
//         store: "Store B"
//     },
//     {
//         id: 'i3',
//         title: 'Broccoli',
//         photo_url: 'https://source.unsplash.com/YHbcum51JB0/840x840',
//         price: 40,
//         store: "Store C"
//     },
//     {
//         id: 'i4',
//         title: 'Buns',
//         photo_url: 'https://source.unsplash.com/I7BSOoPa5hM/840x840',
//         price: 188,
//         store: "Store D"
//     },
//     {
//         id: 'i5',
//         title: 'Carrot',
//         photo_url: 'https://source.unsplash.com/Ws4wd-vJ9M0/840x840',
//         price: 180,
//         store: "Store E"
//     },
// ];



export const dummyStoresData = [
  {
    id: "sdfjkahldfkjash",
    image: "unsplosh.jpg",
    ingredients: [
      {
        discount: 0.7,
        id: "id1",
        image: "usdfanf.jpg",
        name: "chickn",
        price: 5.5,
        store: "balsfka store",
      },
      {
        discount: 0.7,
        id: "id2",
        image: "beefusdfanf.jpg",
        name: "beef",
        price: 6.5,
        store: "balsfka store",
      },
    ],
    recipes: [
      {
        id: "r1",
        image: "unslslaphs.jpg",
        ingredients: ["chickn", "beef"],
        name: "Mystery Meat!",
        store: "balsfka store",
      },
    ],
    title: "balsfka store",
  },
  {
    id: "asdfasfsd",
    image: "unsplosh2.jpg",
    ingredients: [
      {
        discount: 0.7,
        id: "id1",
        image: "usdfanf.jpg",
        name: "broccoli",
        price: 5.5,
        store: "sdafs store",
      },
      {
        discount: 0.7,
        id: "id2",
        image: "beefusdfanf.jpg",
        name: "tomato",
        price: 6.5,
        store: "sdafs store",
      },
    ],
    recipes: [
      {
        id: "r1",
        image: "unslslaphs.jpg",
        ingredients: ["broccoli", "tomato"],
        name: "veggeies!",
        store: "sdafs store",
      },
    ],
    title: "sdafs store",
  }
];

export const dataSections = [
  {
    title: "ingredients",
    data: [
      {
        id: "i1",
        name: "Lettuce",
        image: "https://source.unsplash.com/dS2hi__ZZMk/840x840",
        price: 180,
        store: "Store A",
      },
      {
        id: "i2",
        name: "Patty",
        image: "https://source.unsplash.com/tb6ulgGY5Zc/840x840",
        price: 220,
        store: "Store B",
      },
      {
        id: "i3",
        name: "Broccoli",
        image: "https://source.unsplash.com/YHbcum51JB0/840x840",
        price: 40,
        store: "Store C",
      },
      {
        id: "i4",
        name: "Buns",
        image: "https://source.unsplash.com/I7BSOoPa5hM/840x840",
        price: 188,
        store: "Store D",
      },
      {
        id: "i5",
        name: "Carrot",
        image: "https://source.unsplash.com/Ws4wd-vJ9M0/840x840",
        price: 180,
        store: "Store E",
      },
    ],
  },
  {
    title: "recipes",
    data: [
      {
        id: "r1",
        name: "Hamburger",
        image: "https://source.unsplash.com/dS2hi__ZZMk/840x840",
        ingredients: ["Buns", "Patty", "Lettuce"],
        store: "Store B",
        horizontal: true,
      },
      {
        id: "r2",
        name: "Salad",
        image: "https://source.unsplash.com/tb6ulgGY5Zc/840x840",
        ingredients: ["Lettuce", "Carrot", "Broccoli"],
        store: "Store E",
      },
      {
        id: "r3",
        name: "Stir Fry",
        image: "https://source.unsplash.com/YHbcum51JB0/840x840",
        ingredients: ["Carrot", "Broccoli", "Patty"],
        store: "Store C",
      },
    ],
  },
  {
    title: "stores",
    data: [
      {
        id: "s1",
        name: "STORE A",
        image: "https://source.unsplash.com/dS2hi__ZZMk/840x840",
        ingredients: ["Lettuce", "Tomato"],
      },
      {
        id: "s2",
        name: "STORE B",
        image: "https://source.unsplash.com/tb6ulgGY5Zc/840x840",
        ingredients: ["Tomato"],
      },
      {
        id: "s3",
        name: "STORE C",
        image: "https://source.unsplash.com/YHbcum51JB0/840x840",
        ingredients: ["Hamburger", "Buns", "Carrot"],
      },
      {
        id: "s4",
        name: "STORE D",
        image: "https://source.unsplash.com/I7BSOoPa5hM/840x840",
        ingredients: [],
      },
      {
        id: "s5",
        name: "STORE E",
        image: "https://source.unsplash.com/Ws4wd-vJ9M0/840x840",
        ingredients: ["Broccli", "Apple", "Orange"],
      },
    ],
  },
];

export const dummyIngredients = [
  {
    id: "i1",
    name: "Lettuce",
    image: "https://source.unsplash.com/dS2hi__ZZMk/840x840",
    price: 180,
    store: "Store A",
  },
  {
    id: "i2",
    name: "Patty",
    image: "https://source.unsplash.com/tb6ulgGY5Zc/840x840",
    price: 220,
    store: "Store B",
  },
  {
    id: "i3",
    name: "Broccoli",
    image: "https://source.unsplash.com/YHbcum51JB0/840x840",
    price: 40,
    store: "Store C",
  },
  {
    id: "i4",
    name: "Buns",
    image: "https://source.unsplash.com/I7BSOoPa5hM/840x840",
    price: 188,
    store: "Store D",
  },
  {
    id: "i5",
    name: "Carrot",
    image: "https://source.unsplash.com/Ws4wd-vJ9M0/840x840",
    price: 180,
    store: "Store E",
  },
];

export const dummyRecipes = [
  {
    id: "r1",
    name: "Hamburger",
    image: "https://source.unsplash.com/dS2hi__ZZMk/840x840",
    ingredients: ["Buns", "Patty", "Lettuce"],
    store: "Store B",
    horizontal: true,
  },
  {
    id: "r2",
    name: "Salad",
    image: "https://source.unsplash.com/tb6ulgGY5Zc/840x840",
    ingredients: ["Lettuce", "Carrot", "Broccoli"],
    store: "Store E",
  },
  {
    id: "r3",
    name: "Stir Fry",
    image: "https://source.unsplash.com/YHbcum51JB0/840x840",
    ingredients: ["Carrot", "Broccoli", "Patty"],
    store: "Store C",
  },
];

export const dummyStores = [
  {
    id: "s1",
    name: "STORE A",
    image: "https://source.unsplash.com/dS2hi__ZZMk/840x840",
    ingredients: ["Lettuce", "Tomato"],
  },
  {
    id: "s2",
    name: "STORE B",
    image: "https://source.unsplash.com/tb6ulgGY5Zc/840x840",
    ingredients: ["Tomato"],
  },
  {
    id: "s3",
    name: "STORE C",
    image: "https://source.unsplash.com/YHbcum51JB0/840x840",
    ingredients: ["Hamburger", "Buns", "Carrot"],
  },
  {
    id: "s4",
    name: "STORE D",
    image: "https://source.unsplash.com/I7BSOoPa5hM/840x840",
    ingredients: [],
  },
  {
    id: "s5",
    name: "STORE E",
    image: "https://source.unsplash.com/Ws4wd-vJ9M0/840x840",
    ingredients: ["Broccli", "Apple", "Orange"],
  },
];

export const categories = [
    {
      id: 1,
      name: 'Ingredients',
      photo_url:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
    },
    {
      id: 2,
      name: 'Recipes',
      photo_url: 'https://images.pexels.com/photos/3026802/pexels-photo-3026802.jpeg'
    },
    {
      id: 3,
      name: 'Stores',
      photo_url:
        'https://images.unsplash.com/photo-1533777324565-a040eb52facd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'
    },
  ];

  
export const fakeBackendDataTemplate = [
  {
    id: "uniqueStoreId",
    title: "store 1",
    image: "someRelevantGroceryStoreImage",
    data: [
      {
        title: "ingredients",
        data: [
          {
            id: "i1",
            name: "Lettuce",
            image: "https://source.unsplash.com/dS2hi__ZZMk/840x840",
            price: 180,
            discout: 0,
            store: "Store A",
          },
          {
            id: "i2",
            name: "Patty",
            image: "https://source.unsplash.com/tb6ulgGY5Zc/840x840",
            price: 220,
            discout: 10,
            store: "Store B",
          },
          {
            id: "i3",
            name: "Broccoli",
            image: "https://source.unsplash.com/YHbcum51JB0/840x840",
            price: 40,
            discout: 20,
            store: "Store C",
          },
          {
            id: "i4",
            name: "Buns",
            image: "https://source.unsplash.com/I7BSOoPa5hM/840x840",
            price: 188,
            discout: 0,
            store: "Store D",
          },
          {
            id: "i5",
            name: "Carrot",
            image: "https://source.unsplash.com/Ws4wd-vJ9M0/840x840",
            price: 180,
            discout: 0,
            store: "Store E",
          },
        ],
      },
      {
        title: "recipes",
        data: [
          {
            id: "r1",
            name: "Hamburger",
            image: "https://source.unsplash.com/dS2hi__ZZMk/840x840",
            ingredients: ["Buns", "Patty", "Lettuce"],
            store: "Store B",
            horizontal: true,
          },
          {
            id: "r2",
            name: "Salad",
            image: "https://source.unsplash.com/tb6ulgGY5Zc/840x840",
            ingredients: ["Lettuce", "Carrot", "Broccoli"],
            store: "Store E",
          },
          {
            id: "r3",
            name: "Stir Fry",
            image: "https://source.unsplash.com/YHbcum51JB0/840x840",
            ingredients: ["Carrot", "Broccoli", "Patty"],
            store: "Store C",
          },
        ],
      },
    ],
  },
  {
    id: "uniqueStoreId",
    title: "store 2",
    image: "someRelevantGroceryStoreImage",
    data: [
      {
        title: "ingredients",
        data: [
          {
            id: "i1",
            name: "Lettuce",
            image: "https://source.unsplash.com/dS2hi__ZZMk/840x840",
            price: 180,
            discout: 0,
            store: "Store A",
          },
          {
            id: "i2",
            name: "Patty",
            image: "https://source.unsplash.com/tb6ulgGY5Zc/840x840",
            price: 220,
            discout: 10,
            store: "Store B",
          },
          {
            id: "i3",
            name: "Broccoli",
            image: "https://source.unsplash.com/YHbcum51JB0/840x840",
            price: 40,
            discout: 20,
            store: "Store C",
          },
          {
            id: "i4",
            name: "Buns",
            image: "https://source.unsplash.com/I7BSOoPa5hM/840x840",
            price: 188,
            discout: 0,
            store: "Store D",
          },
          {
            id: "i5",
            name: "Carrot",
            image: "https://source.unsplash.com/Ws4wd-vJ9M0/840x840",
            price: 180,
            discout: 0,
            store: "Store E",
          },
        ],
      },
      {
        title: "recipes",
        data: [
          {
            id: "r1",
            name: "Hamburger",
            image: "https://source.unsplash.com/dS2hi__ZZMk/840x840",
            ingredients: ["Buns", "Patty", "Lettuce"],
            store: "Store B",
            horizontal: true,
          },
          {
            id: "r2",
            name: "Salad",
            image: "https://source.unsplash.com/tb6ulgGY5Zc/840x840",
            ingredients: ["Lettuce", "Carrot", "Broccoli"],
            store: "Store E",
          },
          {
            id: "r3",
            name: "Stir Fry",
            image: "https://source.unsplash.com/YHbcum51JB0/840x840",
            ingredients: ["Carrot", "Broccoli", "Patty"],
            store: "Store C",
          },
        ],
      },
    ],
  },
];

export const dummyRecentItems = [
  {
    screen:"Store",
    type:"Recipe",
    id:"7lJuNgqtoN0duivcf4Kk",
    fakeid:"adfsads",
    storeid: "RCZ90fzdrTNEDZdOCKRI"
  },
  {
    screen:"Home",
    type:"Recipe",
    id:"7lJuNgqtoN0duivcf4Kk",
    fakeid:"sdfafsaf",
    storeid: "RCZ90fzdrTNEDZdOCKRI"
  },
  {
    screen:"Recipe",
    type:"Recipe",
    id:"7lJuNgqtoN0duivcf4Kk",
    fakeid:"sdfafsaf",
    storeid: "RCZ90fzdrTNEDZdOCKRI"
  },
  {
    screen:"Recipes",
    type:"Recipe",
    id:"7lJuNgqtoN0duivcf4Kk",
    fakeid:"sdfafsaf",
    storeid: "RCZ90fzdrTNEDZdOCKRI"
  },
  // {
  //   screen:"Ingredient",
  //   type:"Recipe",
  //   id:"7lJuNgqtoN0duivcf4Kk",
  //   fakeid:"sdfafsaf",
  //   storeid: "RCZ90fzdrTNEDZdOCKRI"
  // },
]