import React, { useEffect } from 'react';

const EventsWidget = () => {
  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.src = "https://happenings.wustl.edu/widget/view?schools=wustl&days=31&num=50&experience=inperson&container=localist-widget-11073029&template=modern";
    script.type = "text/javascript";
    script.defer = true;
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      <div id="localist-widget-11073029" className="localist-widget"></div>
      <div id="lclst_widget_footer">
        <a style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block', width: '81px', marginTop: '10px' }}
           title="Widget powered by Concept3D Event Calendar Software"
           href="https://www.localist.com?utm_source=widget&utm_campaign=widget_footer&utm_medium=branded%20link">
          <img src="//d3e1o4bcbhmj8g.cloudfront.net/assets/platforms/default/about/widget_footer.png"
               alt="Localist Online Calendar Software"
               style={{ verticalAlign: 'middle' }} width="81" height="23" />
        </a>
      </div>
    </div>
  );
};

export default EventsWidget;
