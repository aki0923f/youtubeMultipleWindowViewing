$(function () {
  const $wraps = $('.youtube-wrap');

  // --- 初期化：localStorageのデータを復元 ---
  $wraps.each(function (index) {
    const videoId = localStorage.getItem(`youtube_video_${index}`);
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      const iframe = `<iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
      $(this).html(iframe);
    }
  });

  // --- フォーム送信時の処理 ---
  $wraps.each(function (index) {
    const $form = $(this);
    $form.on('submit', function (e) {
      e.preventDefault();

      const url = $form.find('input[type="text"]').val();
      const videoId = extractYouTubeID(url);

      // 既存のiframeを削除
      $form.next('iframe').remove();

      if (videoId) {
        // 保存
        localStorage.setItem(`youtube_video_${index}`, videoId);

        // iframe生成
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        const iframe = `<iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
        $form.html(iframe);
      } else {
        $form.after('<p style="color:red;">正しいYouTubeのURLを入力してください。</p>');
      }
    });
  });
});

// ----- ローカルストレージ削除 -----
$(function () {
  $('#clear').on('click', function () {
    // localStorage全消し
    localStorage.clear();
    location.reload();
  });
});

// --- YouTubeのURLから動画IDを抽出する関数 ---
function extractYouTubeID(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|embed|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
