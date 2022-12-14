// 用 ajax 接外部 json 檔案，取得後印出資料
$.ajax({
  url: 'assets/json/main.json',
  success: function (data) {
    renderJSON(data.news);
    renderJSON(data.download);
    renderJSON(data.ask);
  },
});

// 印出資料；預設印出前 5 筆資料
function renderJSON(thisJSON) {
  var num = 5;
  if (thisJSON.content.length < 5) {
    num = thisJSON.content.length;
  }
  for (i = 0; i < num; i++) {
    var HTML = `
    <tr>
      <td id="tableTitle">${thisJSON.content[i].title}</td>
      <td id="tableDescription">${thisJSON.content[i].description}</td>
    </tr>`;
    $('.main_content_text[id=' + thisJSON.id + ']')
      .find('tbody')
      .append(HTML);
  }
}

// 切換標籤時，所有標籤與表格先隱藏（去掉 active），再為被點擊的標籤加上 active
function labelActive(e) {
  $('.label').removeClass('active');
  $('.main_content_text').removeClass('active');
  $(e).addClass('active');
  $('.main_content_text[id=' + e.id + ']').addClass('active');
}
