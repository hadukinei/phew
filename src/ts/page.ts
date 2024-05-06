import '../css/reset.scss'
import '../css/page.scss'

import SmoothScrollbar from 'smooth-scrollbar';
import SmoothScrollbarPluginOverscroll from 'smooth-scrollbar/plugins/overscroll';
SmoothScrollbar.use(SmoothScrollbarPluginOverscroll);

(d => {
  d.addEventListener('DOMContentLoaded', () => {
    SmoothScrollbar.initAll({
      damping: 0.15,
      plugins: {
        overscroll: {},
      },
    });
  })
})(document)
