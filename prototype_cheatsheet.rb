require "pdf/writer"
require "pdf/simpletable"

FILE_NAME = "prototype_cheatsheet"

BOTTOM_TABLE_MARGIN = 15

STYLE_OPTIONS = {
  :width=                 => 180,
  :bold_headings=         => true,
  :show_lines=            => :none,
  :show_headings=         => true,
  :heading_font_size=     => 7,
  :orientation=           => :right,
  :position=              => :left,
  :font_size=             => 6,
  :shade_headings=        => true,
  :inner_line_style=      => PDF::Writer::StrokeStyle.new( 0.2 ),
  :shade_heading_color=   => Color::RGB.from_percentage(24, 24, 24),
  :heading_color=         => Color::RGB.from_percentage(100, 100, 100),
  :shade_color=           => Color::RGB.from_percentage(96.1, 96.1, 96.1),
  :line_color=            => Color::RGB.from_percentage(83.5, 83.5, 83.5)
}

def build_table(pdf, name, data)
  PDF::SimpleTable.new do |tab|
    tab.column_order.push(*%w(name))
    tab.columns['name'] = PDF::SimpleTable::Column.new("name") { |col|
      col.heading = name
    }
    STYLE_OPTIONS.each { |style, value|
      tab.send style, value
    }
    tab.data.replace data
    tab.render_on(pdf)
    pdf.y -= BOTTOM_TABLE_MARGIN
  end
end

pdf = PDF::Writer.new( :orientation => :landscape )
pdf.select_font "Helvetica"

event_data = [
  { "name" => "element ( event )" },
  { "name" => "extend ( event )" },
  { "name" => "findElement ( event )" },
  { "name" => "fire ( element, eventName[, memo] )" },
  { "name" => "isLeftClick ( event )" },
  { "name" => "observe ( element, eventName, handler )" },
  { "name" => "pointerX ( event )" },
  { "name" => "pointerY( event )" },
  { "name" => "stop ( event )" },
  { "name" => "stopObserving ( element[, eventName[, handler]] )" }
]
form_data = [
  { "name" => "disable ( formElement )" },
  { "name" => "enable ( formElement )" },
  { "name" => "findFirstElement ( formElement )" },
  { "name" => "focusFirstElement ( formElement )" },
  { "name" => "getElements ( formElement )" },
  { "name" => "getInputs ( formElement[, type[, name]] )" },
  { "name" => "request ( formElement )" },
  { "name" => "reset ( formElement )" },
  { "name" => "serialize ( formElement[, getHash = false] )" },
  { "name" => "serializeElements ( elements[, getHash = false] )" }
]
form_element_data = [
  { "name" => "activate ( element )" },
  { "name" => "clear ( element )" },
  { "name" => "diable ( element )" },
  { "name" => "enable ( element )" },
  { "name" => "focus ( element )" },
  { "name" => "getValue ( element )" },
  { "name" => "present ( element )" },
  { "name" => "select ( element )" },
  { "name" => "serialize ( element )" },
  { "name" => "setValue ( element )" }
]
ajax_data = [
  { "name" => "new Ajax.PeriodicalUpdater( container, url[, options] )" },
  { "name" => "new Ajax.Request( url[, options] )" },
  { "name" => "new Ajax.Updater( container, url[, options] )" }
]
ajax_responders_data = [
  { "name" => "register ( responder )" },
  { "name" => "unregister( responder )" }
]
array_data = [
  { "name" => "clear ( )" },
  { "name" => "clone ( )" },
  { "name" => "compact ( )" },
  { "name" => "each ( iterator[, context] )" },
  { "name" => "first ( )" },
  { "name" => "flatten ( )" },
  { "name" => "from ( iterable )" },
  { "name" => "indexOf ( value )" },
  { "name" => "inspect ( )" },
  { "name" => "last ( )" },
  { "name" => "reduce( )" },
  { "name" => "reverse( [inline=true] )" },
  { "name" => "size( )" },
  { "name" => "toArray( )" },
  { "name" => "toJSON( )" },
  { "name" => "uniq( )" },
  { "name" => "without( value... )" }
]


build_table(pdf, 'Event', event_data)
build_table(pdf, 'Form', form_data)
build_table(pdf, 'Form.Element', form_element_data)
build_table(pdf, 'Ajax', ajax_data)
build_table(pdf, 'Ajax.Responders', ajax_responders_data)
build_table(pdf, 'Array', array_data)

pdf.save_as(FILE_NAME + ".pdf")
