import jQuery from "jquery";

export default function ($) {
    jQuery.fn.lightTabs = function (options) {

        const createTabs = function () {
            const tabs = this;
            let i = 0;

            const showPage = (i) => {
                $(tabs).children("div").children("div").hide();
                $(tabs).children("div").children("div").eq(i).show();
                $(tabs).children("ul").children("li").removeClass("active");
                $(tabs).children("ul").children("li").eq(i).addClass("active");
            }

            showPage(0);

            $(tabs).children("ul").children("li").each(function (index, element) {
                $(element).attr("data-page", i);
                i++;
            });

            $(tabs).children("ul").children("li").click(function () {
                showPage(parseInt($(this).attr("data-page"), 10));
            });
        };
        return this.each(createTabs);
    };
};