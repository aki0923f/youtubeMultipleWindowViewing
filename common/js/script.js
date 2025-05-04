$(function () {
  const $wraps = $('.youtube-wrap');

  $wraps.each(function (index) {
    const $form = $(this);

    // --- 初期化：localStorageのデータを復元 ---
    const videoId = localStorage.getItem(`youtube_video_${index}`);
    if (videoId) {
      $(this).html(addIframeFnc(videoId));
    }

    // --- フォーム送信時の処理 ---
    $form.on('submit', function (e) {
      e.preventDefault();
      const url = $form.find('input[type="text"]').val();
      const videoId = extractYouTubeID(url);
      if (videoId) {
        localStorage.setItem(`youtube_video_${index}`, videoId); // 保存
        $form.html(addIframeFnc(videoId)); // iframe生成
      } else {
        $form.find('.error').remove();
        $form.append('<p class="error" style="color:red;">正しいYouTubeのURLを入力してください。</p>');
      }
    });

    

    // ----- ブラウザリロード -----
    $form.on('click', '.reload', function () {
      $(this).parent().find('iframe').attr('src', $(this).parent().find('iframe').attr('src'));
    });
  });
    
  // ----- クリアボタン押下時 -----
  $wraps.on('click', '.clear-single', function () {
    const $wrap = $(this).closest('.youtube-wrap'); // 押されたボタンの親フォーム
    const index = $('.youtube-wrap').index($wrap); // 親フォームのインデックスを取得
    const key = `youtube_video_${index}`;
  
    if(index > -1) {
      localStorage.removeItem(key); // 指定キーだけ削除
    }

    // 元のフォームに戻す
    const formHtml = `
      <input type="text" placeholder="ここにYouTubeURLを挿入">
      <input type="submit" class="submit">
    `;
    $(this).closest('.youtube-wrap').html(formHtml);
  });

  // ----- ローカルストレージ全消し -----
  $('#clear').on('click', function () {
    localStorage.clear();
    location.reload();
  });

  // ----- 並び替え機能 -----
  $('.youtube-list').sortable({
    handle: '.drag-handle',
    update: function () {
      // 新しい順番でローカルストレージを更新
      $('.youtube-list li').each(function (newIndex) {
        const iframe = $(this).find('.youtube-wrap iframe');
        if (iframe.length) {
          const src = iframe.attr('src');
          const videoId = extractYouTubeID(src);
          if (videoId) {
            localStorage.setItem(`youtube_video_${newIndex}`, videoId);
          }
        } else {
          localStorage.removeItem(`youtube_video_${newIndex}`);
        }
      });
    }
  });
});


// --- YouTubeのURLから動画IDを抽出する関数 ---
function extractYouTubeID(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|embed|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// --- YouTubeIDからiframeを生成する関数 ---
function addIframeFnc(videoId) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
  const iframe = `<iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe><button type="button" class="clear-single">クリア</button><button type="button" class="reload">リロード</button><div class="drag-handle">並べ替え</div>`;
  return iframe;
}
