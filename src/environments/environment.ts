export const environment = {
  production: false,
  keep_login: false,
  Service_worker: false,
  enable_chat: true,
  ws_url: 'https://yourstore.io/api',
  img_baseurl: 'https://yourstore.io/api/',
  socket_url: "https://yourstore.io/",
  socket_path: "/api/socket.io",
  limited_product_count: 50,
  default_img_count: 15,
  variant_img_count: 30,
  quill_config: {
    modules: {
      syntax: false,
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        // ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        // [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image', 'video']
      ]
    }
  },
  defaultSignup: 'pro', // genie (or) pro
  config_data: {
    free_package_id: "5f4cd131573e9a1e680239f1",
    premium_package_id: "5f4cd4c5573e9a1e68023a04",
    dinamic_order_id: ["60b52edf58954c13bf58b5a2", "61dd3dda459e175b4e42736f"],
    hungover_id: "5fbcac07fd6ce3538c2cf355",
    uru_id: "60805f647ee34b5a03e4ca0d",
    hunan: "64218588a747bc1c68ec3bbc",
    oneafrica: "61f66d9edc229625753437a7",
    demo_store: ["5d0ca4c89f21de0314f98f24", "6246ff91d67d125ee981efc6"],
    chettinad_id: "655841a28de10c6f4819daf4",
    dqj_id: "63baccac9892d776be5cae10",
    surgical_id: "65ce121adfcfaa780d5ff8ed",
    tulsi_madras_id: "607a6edd0e7a3b69278c05ea",
    tulsi_ai_catalog_store_id: "5d30013a5c83a702392c4c8b",
    catalog_navigations: ["5d0ca4c89f21de0314f98f24", "5d30013a5c83a702392c4c8b", "667be4d64ad50b7759af6b20"],
    catalog_image: ["61f66d9edc229625753437a7", "5d30013a5c83a702392c4c8b", "667be4d64ad50b7759af6b20"],
    long_desc: ["65ce121adfcfaa780d5ff8ed", "667be4d64ad50b7759af6b20", "643cf7e21738c0521d8c060f"],
    gallery: ["5d0ca4c89f21de0314f98f24", "667be4d64ad50b7759af6b20", "676e4b77bfa39208bbab4c95", "688db84d709f9742eb76814c"],
    gpay: ["639807e9ba2987682301bae3"],
    adv_blogs: ["5d30013a5c83a702392c4c8b", "5d0ca4c89f21de0314f98f24"],
    primary_catalog: [
      "655841a28de10c6f4819daf4",
      "5d30013a5c83a702392c4c8b",
      "667be4d64ad50b7759af6b20",
      "61f66d9edc229625753437a7"
    ]
  },
  company_details: {
    country: "India",
    state: "Tamil Nadu",
    gst_no: "GSTIN33AAFCN2369B1ZT",
    sgst: 9, cgst: 9, igst: 18
  },
  base_url: "http://localhost:4500",
  razorpay_payment_url: "https://api.razorpay.com/v1/checkout/embedded",
  razorpay_redirect_url: "https://yourstore.io/api/others/razorpay_store_payment/5ceb9eb971f2cb809646edd2",
  store_razorpay_redirect_url: "https://yourstore.io/api/store_details/razorpay_payment/",
  temp_logo: "data:image/png;base64,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"
};