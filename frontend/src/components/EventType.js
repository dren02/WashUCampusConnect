import React, { useEffect } from 'react';

const EventType = ({ category }) => {

    const categoryMap = {
        default: 'localist-widget-11073029',
        concerts: 'localist-widget-53630921',
        meetings: 'localist-widget-47970076',
        exhibits: 'localist-widget-53834284',
        lectures: 'localist-widget-33579717',
        research: 'localist-widget-33272447',
        seminar: 'localist-widget-17458651',
    };
    
    const typeMap = {
        default: '',
        concerts: '30449557772574',
        meetings: '30643243314251',
        exhibits: '30643243314251',
        lectures: '30449557777403',
        research: '33741509804990',
        seminar: '33741507785825',
    }

    useEffect(() => {
        const id = categoryMap[category];
        const type = typeMap[category];
        const script = document.createElement('script');
        script.src = `https://happenings.wustl.edu/widget/view?schools=wustl&types=${type}&days=31&num=50&target_blank=1&experience=inperson&container=${id}&template=modern`;
        script.type = "text/javascript";
        script.defer = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [category]);

    return (
        <div>
            <div id={categoryMap[category]} className="localist-widget"></div>
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

export default EventType;
