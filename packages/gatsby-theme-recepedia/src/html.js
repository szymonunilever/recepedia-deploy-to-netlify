import React from 'react';
import PropTypes from 'prop-types';
import newRelic from '../static/config/newRelic';

const config = {
  digitalData: {
    siteInfo: {
      sitetype: process.env['digitalData_siteInfo_sitetype'],
      category: process.env['digitalData_siteInfo_category'],
      country: process.env['digitalData_siteInfo_country'],
      globalbrand: process.env['digitalData_siteInfo_globalbrand'],
      localbrand: process.env['digitalData_siteInfo_localbrand'],
    },
    // eslint-disable-next-line @typescript-eslint/camelcase
    page: {
      attributes: {
        brandCategory: process.env['digitalData_page_attributes_brandCategory'],
        country: process.env['digitalData_page_attributes_country'],
        globalBrand: process.env['digitalData_page_attributes_globalbrand'],
        localBrand: process.env['digitalData_page_attributes_localbrand'],
      },
    },
    trackingInfo: {
      GID: process.env['digitalData_trackingInfo_GID'],
      tool: JSON.parse(process.env['digitalData_trackingInfo_tool']),
    },
  },
};

export default function HTML(props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        {process.env.NODE_ENV !== 'development' && (
          <>
            {/* START preconnects */}
            <link
              rel="preconnect"
              href={process.env['app_local_elasticSearch_searchUrl']}
            />
            <link
              rel="preconnect"
              href="https://d37k6lxrz24y4c.cloudfront.net"
            />
            <link rel="preconnect" href="https://www.google-analytics.com" />
            <link rel="preconnect" href="https://bam.nr-data.net" />
            <link rel="preconnect" href="https://js-agent.newrelic.com" />
            {/* END preconnects */}

            {/* START NewRelic */}
            {/* Having script inline improves FCP/FMP. Loading newRelic script async is not allowed*/}
            {process.env['newRelic_enabled'] === 'true' && (
              <script
                type="text/javascript"
                dangerouslySetInnerHTML={newRelic}
              />
            )}
            {/* END NewRelic */}

            <script
              type="text/javascript"
              dangerouslySetInnerHTML={{
                __html: `
              function isMobile() {
                var check = false;
                  (function(a) {
                      if (/(android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i
                              .test(a)
                              || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|sk\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-/i
                                  .test(a.substr(0, 4))) {
                          check = true;
                      }
                  })(navigator.userAgent || navigator.vendor || window.opera);
                  return check;
              }
              var digitalData = ${JSON.stringify(config.digitalData)};
              var channelVal = "";
              if (isMobile()) {
                  channelVal = "Mobile Site";
              } else {
                  channelVal = "Brand Site";
              }
              digitalData.component = [];
              digitalData.siteInfo.channel = channelVal;
              digitalData.page.category = {
                primaryCategory: channelVal,
              };
              digitalData.privacy = { accessCategories: [{ domains: [] }] };
              `,
              }}
            />
            <script
              type="text/javascript"
              dangerouslySetInnerHTML={{
                __html: `
              window.addEventListener('load', function() {
                  var head = document.getElementsByTagName('head')[0];
                  var script = document.createElement('script');
                  script.type = 'text/javascript';
                  script.src = ${JSON.stringify(
                    process.env['analytics_adobe_url']
                  )};
                  head.appendChild(script);
                });
              `,
              }}
              id="adobe_analytics"
            />
          </>
        )}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
          (function(a, h){
            var botsRegexp = /aolbuild|baidu|bingbot|bingpreview|msnbot|duckduckgo|adsbot-google|googlebot|mediapartners-google|teoma|slurp|yandex/gi;
            window.searchAgentOnPage = h && h==='#noquiz' || botsRegexp.test(a);
          })(navigator.userAgent, location.hash);
          `,
          }}
          id="botDetector"
        />
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
        />
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <noscript key="noscript" id="gatsby-noscript">
          This app works best with JavaScript enabled.
        </noscript>
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
      </body>
    </html>
  );
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
};
