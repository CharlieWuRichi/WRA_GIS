// 用 ajax 接外部 json 檔案，取得後印出資料
$.ajax({
  dataType: 'json',
  method: 'GET',
  url: 'assets/json/main.json',
  success: function (data) {
    renderJSON(data.news);
    renderJSON(data.download);
    renderJSON(data.ask);
  },
});

// 印出資料；預設印出前 5 筆資料
function renderJSON(thisData) {
  var num = 5;
  if (thisData.content.length < 5) {
    num = thisData.content.length;
  }
  for (i = 0; i < num; i++) {
    var HTML = `
    <tr>
      <td id="tableTitle">${thisData.content[i].title}</td>
      <td id="tableDescription">${thisData.content[i].description}</td>
    </tr>`;
    $('.main_content_text[id=' + thisData.id + ']')
      .find('tbody')
      .append(HTML);
  }
}

// 切換標籤時，所有標籤與表格先隱藏（去掉active），再為被點擊的標籤加上 active
function labelActive(e) {
  $('.label').removeClass('active');
  $('.main_content_text').removeClass('active');
  $(e).addClass('active');
  $('.main_content_text[id=' + e.id + ']').addClass('active');
}
