/// <reference path="../../../ts/jquery.d.ts" />

module menu {
    export class MenuItem {
        _name: string;
        _element;
        _ul;
        _entries;

        constructor(name: string, element) {
            this._name = name;
            this._entries = [];
            this._element = element;

            this._ul = null;
        }

        // Add an entry to this menu
        // entry: the name of the entry
        // callback: the function to be called when user click on the entry
        addEntry(entry: string, callback) {
            if (this._ul == null) {
                this._ul = $('<ul/>')
                    .addClass('dropdown-menu')
                    .attr("role", 'menu')
                    .attr('aria-labelledby', 'dropdown' + name);

                this._element.append(this._ul);
            }
            if (entry == "---") {
                this._ul.append($('<li/>').attr('role', 'presentation').addClass('divider'));
                return;
            }
            var li = $('<li/>').attr("role", "presentation");
            var a = $('<a/>')
                .attr('role', 'menuitem')
                .attr('tabindex', '-1')
                .attr("href", 'javascript:void()').html(entry);

            a.on('click', function (e) {
                if (!$(this).parent().hasClass("disabled")) {
                    callback();
                } else
                    e.stopPropagation();
            });

            li.append(a);

            this._ul.append(li);
        }

        enableEntry(enable, entry) {
            $.each(this._ul.children(), function (index, li) {
                if ($(li).find('a').html() == entry) {
                    if (enable) {
                        $(li).removeClass("disabled")
                        } else {
                        $(li).addClass("disabled");
                    }
                }
            });
        }
    }

    export class Menu {

        _element: any;
        _items: MenuItem[];

        constructor(element) {
            this._items = [];
            this._element = element;
        }

        // Add a Top level menu
        // name: the name of the menu
        addEntry(name: string): MenuItem {
            // add to bootstrap menu
            var m = $('<div/>').addClass("dropdown");
            var btn = $('<button/>')
                .addClass('btn btn-default dropdown-toggle menu-button')
                .attr("type", "button")
                .attr("id", name.toLowerCase() + "-menu")
                .attr("data-toggle", 'dropdown')
                .html(name);

            btn.append($("<span/>").addClass('caret'));
            m.append(btn);

            this._element.append(m);

            var item = new MenuItem(name, m)
                this._items.push(item);

            return item;
        }

        // enable or disable the specified entry
        enableEntry(enable, entry) {
            $.each(this._items, function (index, e) {
                var div = e._element;
                var btn = $(div).find('button');
                if (btn.html().indexOf(entry) == 0) {
                    if (enable) {
                        btn.removeClass("disabled")
                        } else {
                        btn.addClass("disabled");
                    }
                }
            });
        }
    }
}