/*
TODO:

- Show/Hide 

- how will filter specific data/datypes be passed/used?

- visual' columns (e.g first col. in example) need corresponding pre image logic, and type-specific text or mapping.

- "+" row is not a "data element", put outside of datatable / allow click of row and modal or abs. pos. element below.

*/

TABLE_DATA = {
    "headers":[
        {"sTitle":"", "sClass": "center"}, 
        {"sTitle":"", "sClass": "center", "sType":"title", "fnRender":status_indicator},
        {"sTitle":"Name"}, 
        {"sTitle":"Id"},
        {"sTitle":"Type"},
        {"sTitle":"Uptime"},
        {"sTitle":"Port"},
        {"sTitle":"Last Comm."},
        {"sTitle":"Last Data"},
        {"sTitle":"Last Note"},
        {"sTitle":"Open Tkt"}
    ],
    "data":[
        ["+", "Normal", "Platform AS02CPSM", 274500, "OOI", "05:12:33", 1000, "12:10:14 10.15.30", "10:10:14 11.25.20", "Last Note1..", 1],
        ["+", "Alarm", "Platform AS02CPSM", 174501, "OOI", "05:12:33", 3000, "12:10:14 10.15.30", "10:10:14 11.25.20", "Last Note2..", 1],
        ["+", "Unknown", "Platform AS02CPSM", 275504, "OOI", "05:12:33", 2000, "12:10:14 10.15.30", "10:10:14 11.25.20", "Last Note3..", 1],
        ["+", "Normal", "Platform AS02CPSM", 274503, "OOI", "05:12:33", 4000, "12:10:14 10.15.30", "10:10:14 11.25.20", "Last Note4..", 1],
        ["+", "Normal", "Platform AS02CPSM", 473508, "OOI", "05:12:33", 2000, "12:10:14 10.15.30", "10:10:14 11.25.20", "Last Note5..", 1],
        ["+", "Alert", "Platform AS02CPSM", 274508, "OOI", "05:12:33", 7000, "12:10:14 10.15.30", "10:10:14 11.25.20", "Last Note6..", 1],
        ["+", "Normal", "Platform AS02CPSM", 974508, "OOI", "05:12:33", 2000, "12:10:14 10.15.30", "10:10:14 11.25.20", "Last Note7..", 1],
        ["+", "Normal", "Platform AS02CPSM", 271501, "OOI", "05:12:33", 9000, "12:10:14 10.15.30", "10:10:14 11.25.20", "Last Note8..", 1],
        ["+", "Normal", "Platform AS02CPSM", 274508, "OOI", "05:12:33", 2000, "12:10:14 10.15.30", "10:10:14 11.25.20", "Last Note9..", 1],
        ["+", "Normal", "Platform AS02CPSM", 274508, "OOI", "05:12:33", 1000, "12:10:14 10.15.30", "10:10:14 11.25.20", "Last Note10.", 1],
        ["+", "Normal", "Platform AS02CPSM", 471508, "OOI", "05:12:33", 2000, "12:10:14 10.15.30", "10:10:14 11.25.20", "Last Note11.", 1],
        ["+", "Normal", "Platform AS02CPSM", 970508, "OOI", "05:12:33", 3000, "12:10:14 10.15.30", "10:10:14 11.25.20", "Last Note12.", 1],
        ["+", "Normal", "Platform AS02CPSM", 374508, "OOI", "05:12:33", 7000, "12:10:14 10.15.30", "10:10:14 11.25.20", "Last Note13.", 1],
        ["+", "Normal", "Platform AS02CPSM", 274508, "OOI", "05:12:33", 2000, "12:10:14 10.15.30", "10:10:14 11.25.20", "Last Note14.", 1],
    ]
}


/* The below will be View instance attrs: */
OPERATORS = ['CONTAINS', 'NEWER THAN', 'OLDER THAN', 'GREATER THAN', 'LESS THAN'];
COLUMNS = _.map(TABLE_DATA.headers, function(e){return e['sTitle']});
COLUMNS_FILTERABLE = _.reject(COLUMNS, function(e){return e==""}); 


function status_indicator(obj){
    var stat = obj.aData[obj.iDataColumn];
    var pos_map = {"Uknown":"0px 0px", "Normal":"0px -20px", "Alert":"0px -40px", "Alarm":"0px 18px"};
    var stat_pos = pos_map[stat];
    var html = "<div class='status_indicator_sprite' style='background-position:"+stat_pos+"' title='"+stat+"'>&nbsp;</div>";
    return html;
}


IONUX.Views.DataTable = Backbone.View.extend({

    events: {
        "click .filter-add":"add_filter_item",
        "click .filter-remove":"remove_filter_item",
        "click .show-hide-filters":"show_hide_filters",
        "click .filters-apply":"filters_apply",
        "click .filters-reset":"filters_reset",
    },

    template: _.template($('#datatable-tmpl').html()),

    initialize: function() {
        this.render().el;
    },
    render: function() {
        this.$el.html(this.template());
        this.datatable = this.$el.find(".datatable-container table").dataTable({
            "aaData":this.options.data.data,
            "aoColumns":this.options.data.headers
        });
        return this;
    },

    add_filter_item: function(evt){
        var filter_item_tmpl = [
          '<div class="filter-item">',
            '<select class="column"><% _.each(columns, function(e){%> <option value="<%= e.replace(/ /g, "_") %>"><%= e %></option><%});%></select>',
            '<select class="operator"><% _.each(operators, function(e){%> <option value="<%= e.replace(/ /g, "_") %>"><%= e %></option><%});%></select>',
            '<input class="argument" type="text" value="">',
            '<span class="filter-add">+</span><span class="filter-remove">-</span>',
          '</div>'].join('');
        var data = {"columns":COLUMNS_FILTERABLE, "operators":OPERATORS};
        var filter_item = _.template(filter_item_tmpl)(data);
        if (evt == null){
            var filter_items = this.$el.find(".filter-item");
            if (filter_items.length == 0){
                this.$el.find(".filter-items").append(filter_item);
            }
        } else {
            var target = $(evt.target);
            target.parent().after(filter_item);
        }
    },

    show_hide_filters: function(evt){
        var target = $(evt.target);
        var filter_items = this.$el.find(".filter-items");
        var filter_controls = this.$el.find(".filter-controls");
        if (target.hasClass("hidden")){ 
            target.text("CLOSE").removeClass("hidden");
            this.add_filter_item(null);
            filter_items.slideDown("fast", function(){ filter_controls.show();});
        } else {
            target.text("FILTER").addClass("hidden");
            filter_controls.hide();
            filter_items.slideUp("fast");
        }
    },

    remove_filter_item: function(evt){
        var this_filter_item = $(evt.target).parent();
        var filter_items = this.$el.find(".filter-item");
        if (filter_items.length > 1) {
            this_filter_item.remove();
            return;
        }
        //todo: remove single filter: this.datatable.fnFilter('', filter_index);
    },

    filters_apply: function(evt){
        var filter_items = this.$el.find(".filter-items");
        var self = this;
        filter_items.find(".filter-item").each(function(i, filter_item){
            var selected_val = $(filter_item).find("select.column option:selected").text();
            var selected_index = _.indexOf(COLUMNS, selected_val);
            var filter_val = $(filter_item).find("input").val();
            self.datatable.fnFilter(filter_val, selected_index);
        });
    },

    filters_reset: function(evt){
        var filter_items = this.$el.find(".filter-items");
        filter_items.find("input").each(function(i, e){
            $(e).val("");
        });
        this.datatable.fnFilterClear();
    }
});
