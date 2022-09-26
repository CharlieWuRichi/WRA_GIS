$.ajax({
  dataType: 'json',
  method: 'GET',
  url: 'assets/json/news.json',
  data: '',
  success: function (data) {
    console.log(data);
    renderJSON(data);
  },
});

// 印出前五項資料
function renderJSON(data) {
  for (i = 0; i < 5; i++) {
    var newsHTML = `
  		<tr>
  		<td id="tableDate">${data.news[i].date}</td>
  		<td id="tableContent">${data.news[i].description}</td>
  		</tr>`;
    $('.main_content_text[id=labelNews]')
      .children()
      .children()
      .append(newsHTML);
  }

  for (i = 0; i < 5; i++) {
    var downloadHTML = `
			<tr>
			<td id="tableDate">${data.download[i].title}</td>
			<td id="tableContent">${data.download[i].url}</td>
			</tr>`;
    $('.main_content_text[id=labelDownload]')
      .children()
      .children()
      .append(downloadHTML);
  }

  for (i = 0; i < 5; i++) {
    var askHTML = `
			<tr>
			<td id="tableDate">${data.ask[i].date}</td>
			<td id="tableContent">${data.ask[i].description}</td>
			</tr>`;
    $('.main_content_text[id=labelAsk]').children().children().append(askHTML);
  }
}

function labelActive(e) {
  $('.label').removeClass('active');
  $('.main_content_text').removeClass('active');
  $(e).addClass('active');
  $('.main_content_text[id=' + e.id + ']').addClass('active');
}
