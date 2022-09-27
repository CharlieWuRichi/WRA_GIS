// 用ajax接外部json檔案，取得後執行renderJSON()
$.ajax({
  dataType: 'json',
  method: 'GET',
  url: 'assets/json/main.json',
  data: '',
  success: function (data) {
    renderJSON(data.news);
    renderJSON(data.download);
    renderJSON(data.ask);
  },
});

// 在main_content_text中印出資料，預設印出前5筆資料
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

// 切換標籤時，所有標籤與表格先隱藏（去掉active），再為被點擊的標籤加上active
function labelActive(e) {
  $('.label').removeClass('active');
  $('.main_content_text').removeClass('active');
  $(e).addClass('active');
  $('.main_content_text[id=' + e.id + ']').addClass('active');
}
