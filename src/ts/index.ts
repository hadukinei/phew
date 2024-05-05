import '../css/reset.scss'
import '../css/index.scss'

/**
 * Smooth Scrollbar
 * @copyright https://www.npmjs.com/package/smooth-scrollbar
 * settings: https://idiotwu.github.io/smooth-scrollbar/
 */
import SmoothScrollbar from 'smooth-scrollbar';
import SmoothScrollbarPluginOverscroll from 'smooth-scrollbar/plugins/overscroll';
SmoothScrollbar.use(SmoothScrollbarPluginOverscroll);


const init =() => {
  /*const ssb = */SmoothScrollbar.initAll({
    damping: 0.15,
    plugins: {
      overscroll: {},
    },
  });

  /**
   * Swiperと併用する場合、干渉して左右軸（X軸）へのスクロールバーが生成されてしまう
   * 現状はスクロールが発生するたびにX座標をゼロにリセットしているが何か方法があれば改善すること
   */
  /*
  ssb.forEach(d => {
    const obs = new MutationObserver(list => {
      list.forEach(e => {
        (e.target as HTMLElement).style.transform = (e.target as HTMLElement).style.transform.replace(/\(.+?,/, "(0px,").replace(/[\s,]+/g, ",");
      });
    });
    obs.observe(d.contentEl, {attributes: true});
  })
  */
};


(d => {
  d.addEventListener('DOMContentLoaded', () => {
    init()
  })
})(document)
