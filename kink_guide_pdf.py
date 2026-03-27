"""
A Beginner's Guide to Kink — Direct-to-PDF via ReportLab
V008 — diamond replaces mirror icon (overflow fix)
Saved: 20260327
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether, Flowable, CondPageBreak
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import (
    Drawing, Circle, Rect, Line, Polygon, Ellipse
)
from reportlab.graphics import renderPDF
import math

FONT_DIR_G = "/usr/share/fonts/truetype/google-fonts/"
FONT_DIR_L = "/usr/share/fonts/truetype/liberation/"

pdfmetrics.registerFont(TTFont('Poppins',        FONT_DIR_G + 'Poppins-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Poppins-Bold',   FONT_DIR_G + 'Poppins-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Poppins-Italic', FONT_DIR_G + 'Poppins-Italic.ttf'))
pdfmetrics.registerFont(TTFont('Poppins-Medium', FONT_DIR_G + 'Poppins-Medium.ttf'))
pdfmetrics.registerFont(TTFont('Body',           FONT_DIR_L + 'LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Body-Bold',      FONT_DIR_L + 'LiberationSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Body-Italic',    FONT_DIR_L + 'LiberationSans-Italic.ttf'))
pdfmetrics.registerFont(TTFont('Body-BoldItalic',FONT_DIR_L + 'LiberationSans-BoldItalic.ttf'))

pdfmetrics.registerFontFamily('Poppins', normal='Poppins', bold='Poppins-Bold',
    italic='Poppins-Italic', boldItalic='Poppins-Bold')
pdfmetrics.registerFontFamily('Body', normal='Body', bold='Body-Bold',
    italic='Body-Italic', boldItalic='Body-BoldItalic')

class P:
    cream       = colors.HexColor('#FDF8F2')
    ink         = colors.HexColor('#2D2D2D')
    ink_mid     = colors.HexColor('#5A5A5A')
    ink_soft    = colors.HexColor('#888888')
    sage        = colors.HexColor('#5E9180')
    sage_dark   = colors.HexColor('#3D6B5A')
    sage_pale   = colors.HexColor('#EAF3F0')
    terra       = colors.HexColor('#C8714A')
    terra_dark  = colors.HexColor('#9E4F2D')
    terra_pale  = colors.HexColor('#FDF0E8')
    gold        = colors.HexColor('#C49520')
    gold_pale   = colors.HexColor('#FDF5DC')
    amber       = colors.HexColor('#B87820')
    amber_pale  = colors.HexColor('#FDF3DC')
    success     = colors.HexColor('#4A8F6A')
    success_pale= colors.HexColor('#EDF7F1')
    white       = colors.white

W, H = letter
MARGIN = 0.85 * inch
CW = W - 2 * MARGIN

def S(name, font, size, color, leading=None, space_before=0, space_after=6, alignment=TA_LEFT):
    return ParagraphStyle(name, fontName=font, fontSize=size, textColor=color,
        leading=leading or size*1.4, spaceBefore=space_before, spaceAfter=space_after, alignment=alignment)

sH1      = S('H1',   'Poppins-Bold',   22, P.sage_dark,  30, 20, 8)
sH2      = S('H2',   'Poppins-Bold',   16, P.terra_dark, 22, 16, 6)
sH3      = S('H3',   'Poppins-Bold',   13, P.ink,        18, 12, 4)
sBody    = S('Body', 'Body',         10.5, P.ink,       15.5,  2, 6)
sBodySm  = S('BSm',  'Body',          9.5, P.ink,         14,  2, 4)
sBreathe = S('Bth',  'Poppins-Bold',   14, P.sage_dark,   20,  6, 4, TA_CENTER)
sBrSub   = S('BthS', 'Body-Italic',    10, P.ink_mid,     14,  0, 0, TA_CENTER)
sGloss   = S('Gls',  'Body',           10, P.ink,       14.5,  2, 8)
sGlossTerm=S('GlsT', 'Poppins-Bold',   12, P.terra_dark,  17, 10, 2)
sCover1  = S('Cv1',  'Poppins-Bold',   30, P.sage_dark,   38,  0, 8, TA_CENTER)
sCover2  = S('Cv2',  'Body-Italic',    12, P.ink_mid,     17,  0, 0, TA_CENTER)

def body(text): return Paragraph(text, sBody)
def h2(text, color=None):
    if color:
        return Paragraph(text, ParagraphStyle('H2c', parent=sH2, textColor=color))
    return Paragraph(text, sH2)
def sp(n=8): return Spacer(1, n)

def ibold(t): return f'<font name="Body-Bold">{t}</font>'
def iterm(t): return f'<font name="Body-Bold" color="#{P.terra_dark.hexval()[2:]}">{t}</font>'
def ilink(text, u):
    return f'<a href="{u}"><font name="Body-Bold" color="#{P.terra_dark.hexval()[2:]}">{text}</font></a>'
def url(address):
    href = address if address.startswith('http') else f'https://{address}'
    return f'<a href="{href}"><font name="Body" color="#{P.terra_dark.hexval()[2:]}">{address}</font></a>'
def term_def(term, definition):
    return Paragraph(
        f'<font name="Body-Bold" color="#{P.terra_dark.hexval()[2:]}">{term}</font>'
        f' <font name="Body-Italic" color="#{P.ink_mid.hexval()[2:]}" size="9.5">({definition})</font>', sBody)

# ── Icons ──────────────────────────────────────────────────────────────────────
# ICON RENDERING NOTES (learned through V001-V007):
# 1. ReportLab Polygon fill rule fills the ENTIRE convex hull — cannot draw true annuli.
#    Any ring/donut shape must use Circle+Circle (not Polygon) or be replaced with a
#    different icon shape entirely.
# 2. LEFTPADDING in Table cells does NOT apply to Drawing flowables the same way as
#    Paragraphs. Drawings are placed at the raw cell-left edge. Bake margins INTO the
#    Drawing itself — do not rely on table padding to keep shapes inside card borders.
# 3. Always test new icons in isolation at s=26 with renderPM before adding to script.
# 4. For the 'foot' icon: Drawing is fixed at 36pt (= icon_card column width) with
#    10.9pt left margin baked in. Do not change without re-testing.

def draw_icon(icon_name, size=22, fg=None, bg=None):
    fg = fg or P.sage
    d = Drawing(size, size)
    s = size

    if icon_name == 'exchange':
        d.add(Rect(s*.10, s*.12, s*.80, s*.20, fillColor=fg, strokeColor=None))
        heights=[s*.90,s*.62,s*.84,s*.62,s*.90]; xs=[s*.10,s*.30,s*.50,s*.70,s*.90]
        for i in range(4):
            d.add(Polygon([xs[i],s*.32,xs[i+1],s*.32,(xs[i]+xs[i+1])/2,heights[i]], fillColor=fg, strokeColor=None))
        for jx in [s*.30,s*.50,s*.70]:
            d.add(Circle(jx, s*.22, s*.055, fillColor=P.cream, strokeColor=None))
    elif icon_name == 'lock':
        # Padlock — replaces rope-coil (annulus polygon unfillable in ReportLab)
        cx = s / 2
        sw_o = s * 0.34; sw_i = s * 0.20
        leg_top = s * 0.52; leg_bot = s * 0.70
        pts = [cx - sw_o, leg_bot, cx - sw_o, leg_top]
        for i in range(13):
            a = math.pi + math.pi * i / 12
            pts += [cx + sw_o * math.cos(a), leg_top + sw_o * math.sin(a)]
        pts += [cx + sw_o, leg_top, cx + sw_o, leg_bot,
                cx + sw_i, leg_bot, cx + sw_i, leg_top]
        for i in range(13):
            a = math.pi + math.pi * (12 - i) / 12
            pts += [cx + sw_i * math.cos(a), leg_top + sw_i * math.sin(a)]
        pts += [cx - sw_i, leg_top, cx - sw_i, leg_bot]
        d.add(Polygon(pts, fillColor=fg, strokeColor=None))
        d.add(Rect(cx - s*0.38, s*0.10, s*0.76, s*0.46, rx=s*0.06,
                   fillColor=fg, strokeColor=None))
        d.add(Circle(cx, s*0.36, s*0.10, fillColor=P.cream, strokeColor=None))
        d.add(Rect(cx - s*0.06, s*0.10, s*0.12, s*0.20,
                   fillColor=P.cream, strokeColor=None))
    elif icon_name == 'feather':
        shaft=[]
        for i in range(10):
            t=i/9; x=s*.18+t*(s*.80-s*.18); y=s*.12+t*(s*.86-s*.12)
            shaft+=[x-s*.025,y+s*.025]
        for i in range(10):
            t=(9-i)/9; x=s*.18+t*(s*.80-s*.18); y=s*.12+t*(s*.86-s*.12)
            shaft+=[x+s*.025,y-s*.025]
        d.add(Polygon(shaft,fillColor=fg,strokeColor=None))
        lv=[]
        for t in [.20,.38,.55,.72]:
            x=s*.18+t*(s*.80-s*.18); y=s*.12+t*(s*.86-s*.12); lv+=[x-s*.025,y+s*.025]
        lv+=[s*.10,s*.50,s*.06,s*.34]; d.add(Polygon(lv,fillColor=fg,strokeColor=None))
        rv=[]
        for t in [.20,.38,.55,.72]:
            x=s*.18+t*(s*.80-s*.18); y=s*.12+t*(s*.86-s*.12); rv+=[x+s*.025,y-s*.025]
        rv+=[s*.60,s*.66,s*.76,s*.82]; d.add(Polygon(rv,fillColor=fg,strokeColor=None))
        d.add(Circle(s*.80,s*.86,s*.055,fillColor=fg,strokeColor=None))
    elif icon_name == 'mask':
        # Eye mask — horizontal pill band with prominent eye holes
        cx = s / 2
        mw = s * 0.90; mh = s * 0.38
        mx = (s - mw) / 2; my = s * 0.34
        er = mh / 2
        d.add(Rect(mx+er, my, mw-2*er, mh, fillColor=fg, strokeColor=None))
        d.add(Circle(mx+er, my+er, er, fillColor=fg, strokeColor=None))
        d.add(Circle(mx+mw-er, my+er, er, fillColor=fg, strokeColor=None))
        ew = s * 0.25; eh = s * 0.20
        d.add(Ellipse(cx-s*0.38, my+er-eh/2, ew, eh, fillColor=P.cream, strokeColor=None))
        d.add(Ellipse(cx+s*0.13, my+er-eh/2, ew, eh, fillColor=P.cream, strokeColor=None))
        d.add(Rect(cx-s*0.04, my, s*0.08, mh*0.4, fillColor=fg, strokeColor=None))
    elif icon_name == 'eye':
        cx,cy=s/2,s/2; pts=[]
        for i in range(20):
            a=math.pi*i/10
            x=cx+s*.42*math.cos(a); y=cy+(s*.22 if a<math.pi else s*.12)*math.sin(a); pts+=[x,y]
        d.add(Polygon(pts,fillColor=fg,strokeColor=None))
        d.add(Circle(cx,cy,s*.1,fillColor=P.white,strokeColor=None))
        d.add(Circle(cx,cy,s*.06,fillColor=fg,strokeColor=None))
    elif icon_name == 'candle':
        cw,ch=s*.3,s*.5; cx=(s-cw)/2; cy=s*.08
        d.add(Rect(cx,cy,cw,ch,fillColor=fg,strokeColor=None))
        d.add(Line(s/2,cy+ch,s/2,cy+ch+s*.12,strokeColor=P.ink_mid,strokeWidth=s*.05))
        d.add(Polygon([s/2,cy+ch+s*.34,s/2-s*.08,cy+ch+s*.18,s/2,cy+ch+s*.12,s/2+s*.08,cy+ch+s*.18],fillColor=P.terra,strokeColor=None))
    elif icon_name == 'hand':
        hw,hh=s*.14,s*.40; hx=s*.43; hy=s*.10
        d.add(Rect(hx,hy,hw,hh,rx=s*.04,fillColor=fg,strokeColor=None))
        d.add(Circle(hx+hw/2,hy,s*.10,fillColor=fg,strokeColor=None))
        bx=hx+hw/2; by=hy+hh
        for ex,ey in [(s*.06,s*.97),(s*.22,s*.95),(s*.50,s*.92),(s*.74,s*.95),(s*.90,s*.97)]:
            dx=ex-bx; dy=ey-by; ln=math.sqrt(dx*dx+dy*dy) or 1
            px=-dy/ln; py=dx/ln; wb=s*.040; wt=s*.013
            d.add(Polygon([bx+px*wb,by+py*wb,bx-px*wb,by-py*wb,ex-px*wt,ey-py*wt,ex+px*wt,ey+py*wt],fillColor=fg,strokeColor=None))
    elif icon_name == 'bubble':
        # Speech bubble — rounded rect body + triangle tail + dots
        cx = s / 2
        bw = s * 0.82; bh = s * 0.58
        bx = (s - bw) / 2; by = s * 0.34
        rr = s * 0.13
        d.add(Rect(bx, by, bw, bh, rx=rr, fillColor=fg, strokeColor=None))
        d.add(Polygon([bx+s*0.08, by, bx+s*0.32, by, bx-s*0.05, by-s*0.22],
                      fillColor=fg, strokeColor=None))
        dot_y = by + bh * 0.52; dot_r = s * 0.085
        for dx in [-s*0.22, 0, s*0.22]:
            d.add(Circle(cx+dx, dot_y, dot_r, fillColor=P.white, strokeColor=None))
    elif icon_name == 'star':
        bx,by,br=s*.50,s*.70,s*.21
        d.add(Circle(bx,by,br,fillColor=fg,strokeColor=None))
        d.add(Circle(bx,by,br*.52,fillColor=P.cream,strokeColor=None))
        sw=s*.11; d.add(Rect(bx-sw/2,s*.10,sw,s*.58,fillColor=fg,strokeColor=None))
        d.add(Rect(bx,s*.14,s*.16,s*.09,fillColor=fg,strokeColor=None))
        d.add(Rect(bx,s*.29,s*.14,s*.08,fillColor=fg,strokeColor=None))
    elif icon_name == 'check':
        d.add(Line(s*.15,s*.5,s*.42,s*.22,strokeColor=fg,strokeWidth=s*.14,strokeLineCap=1))
        d.add(Line(s*.38,s*.25,s*.85,s*.78,strokeColor=fg,strokeWidth=s*.14,strokeLineCap=1))
    elif icon_name == 'shield':
        cx=s/2
        d.add(Polygon([cx-s*.38,s*.85,cx-s*.38,s*.38,cx,s*.08,cx+s*.38,s*.38,cx+s*.38,s*.85,cx,s*1.0],fillColor=fg,strokeColor=None))
        d.add(Line(cx-s*.16,s*.52,cx-s*.02,s*.38,strokeColor=P.white,strokeWidth=s*.1,strokeLineCap=1))
        d.add(Line(cx-s*.04,s*.4,cx+s*.2,s*.65,strokeColor=P.white,strokeWidth=s*.1,strokeLineCap=1))
    elif icon_name == 'warn':
        d.add(Polygon([s/2,s*.9,s*.06,s*.1,s*.94,s*.1],fillColor=fg,strokeColor=None))
        d.add(Rect(s/2-s*.055,s*.28,s*.11,s*.34,fillColor=P.white,strokeColor=None))
        d.add(Circle(s/2,s*.2,s*.07,fillColor=P.white,strokeColor=None))
    elif icon_name == 'heart':
        cx,cy=s/2,s*.52; r=s*.25
        d.add(Circle(cx-r*.38,cy,r,fillColor=fg,strokeColor=None))
        d.add(Circle(cx+r*.38,cy,r,fillColor=fg,strokeColor=None))
        d.add(Rect(cx-r*1.2,cy-r*.55,r*2.4,r*.7,fillColor=fg,strokeColor=None))
        d.add(Polygon([cx-r*1.2,cy-r*.20, cx+r*1.2,cy-r*.20, cx,cy-r*1.90],
                      fillColor=fg,strokeColor=None))
    elif icon_name == 'book':
        d.add(Rect(s*.12,s*.08,s*.72,s*.84,rx=s*.04,fillColor=fg,strokeColor=None))
        d.add(Rect(s*.18,s*.12,s*.58,s*.76,fillColor=P.white,strokeColor=None))
        d.add(Line(s*.28,s*.1,s*.28,s*.9,strokeColor=fg,strokeWidth=s*.06))
        for fy in [.3,.42,.54,.66]: d.add(Line(s*.35,s*fy,s*.68,s*fy,strokeColor=P.ink_soft,strokeWidth=s*.04))
    elif icon_name == 'clipboard':
        d.add(Rect(s*.1,s*.08,s*.8,s*.84,rx=s*.05,fillColor=fg,strokeColor=None))
        d.add(Rect(s*.35,s*.04,s*.3,s*.14,rx=s*.04,fillColor=P.ink_mid,strokeColor=None))
        for fy in [.30,.44,.58,.72]: d.add(Rect(s*.2,s*fy-s*.04,s*.6,s*.05,fillColor=P.white,strokeColor=None))
        d.add(Line(s*.2,s*.3,s*.27,s*.24,strokeColor=P.success,strokeWidth=s*.07,strokeLineCap=1))
        d.add(Line(s*.25,s*.26,s*.34,s*.36,strokeColor=P.success,strokeWidth=s*.07,strokeLineCap=1))
    elif icon_name == 'map':
        # Location pin
        cx,cy=s*.50,s*.64; r=s*.30
        d.add(Circle(cx,cy,r,fillColor=fg,strokeColor=None))
        d.add(Circle(cx,cy,r*.40,fillColor=P.cream,strokeColor=None))
        d.add(Polygon([cx-r*.52,cy-r*.28, cx+r*.52,cy-r*.28, cx,s*.07],
                      fillColor=fg,strokeColor=None))
    elif icon_name == 'hourglass':
        cx=s/2
        d.add(Polygon([s*.14,s*.88,s*.86,s*.88,s*.56,s*.52,s*.44,s*.52],fillColor=fg,strokeColor=None))
        d.add(Polygon([s*.14,s*.12,s*.86,s*.12,s*.56,s*.48,s*.44,s*.48],fillColor=fg,strokeColor=None))
        d.add(Rect(cx-s*.06,s*.46,s*.12,s*.08,fillColor=fg,strokeColor=None))
        d.add(Polygon([s*.20,s*.14,s*.80,s*.14,s*.54,s*.40,s*.46,s*.40],fillColor=P.cream,strokeColor=None))
        d.add(Rect(s*.10,s*.86,s*.80,s*.06,fillColor=fg,strokeColor=None))
        d.add(Rect(s*.10,s*.08,s*.80,s*.06,fillColor=fg,strokeColor=None))
    elif icon_name == 'scales':
        cx=s/2
        d.add(Rect(cx-s*.04,s*.10,s*.08,s*.72,fillColor=fg,strokeColor=None))
        d.add(Rect(s*.10,s*.72,s*.80,s*.07,fillColor=fg,strokeColor=None))
        d.add(Rect(s*.26,s*.08,s*.48,s*.06,fillColor=fg,strokeColor=None))
        d.add(Line(s*.18,s*.79,s*.18,s*.60,strokeColor=fg,strokeWidth=s*.04))
        d.add(Ellipse(s*.06,s*.54,s*.24,s*.09,fillColor=fg,strokeColor=None))
        d.add(Line(s*.82,s*.79,s*.82,s*.66,strokeColor=fg,strokeWidth=s*.04))
        d.add(Ellipse(s*.70,s*.60,s*.24,s*.09,fillColor=fg,strokeColor=None))
        d.add(Circle(cx,s*.79,s*.06,fillColor=fg,strokeColor=None))
    elif icon_name == 'mirror':
        # Diamond gem — replaces mirror (oval overflowed Drawing by 1.04pt at s=26).
        # 4-point Polygon: guaranteed 2.6pt margin on all sides at s=26. Cannot overflow.
        cx, cy = s/2, s/2
        r = s * 0.40
        d.add(Polygon([cx, cy+r, cx+r, cy, cx, cy-r, cx-r, cy],
                      fillColor=fg, strokeColor=None))
        d.add(Circle(cx, cy, s*0.09, fillColor=P.cream, strokeColor=None))
    elif icon_name == 'flame':
        cx=s/2
        pts=[]
        for i in range(20):
            a=math.pi*2*i/20
            t=0.5+0.5*math.cos(a-math.pi)
            r=s*(0.08+0.30*t)
            ox=s*0.02*math.sin(a*2)*t
            pts+=[cx+r*math.sin(a)+ox, s*0.12+(s*0.76)*(0.5-0.5*math.cos(a-math.pi))]
        d.add(Polygon(pts,fillColor=fg,strokeColor=None))
        pts2=[]
        for i in range(16):
            a=math.pi*2*i/16
            t=0.5+0.5*math.cos(a-math.pi)
            r=s*(0.03+0.13*t)
            pts2+=[cx+r*math.sin(a), s*0.18+(s*0.44)*(0.5-0.5*math.cos(a-math.pi))]
        d.add(Polygon(pts2,fillColor=P.cream,strokeColor=None))
    elif icon_name == 'foot':
        # Hand/massage icon.
        # CRITICAL: Drawing is fixed at 36pt (= icon_card column width) regardless of
        # 'size' param. Left margin 10.9pt baked in (verified pre-commit V007).
        # Do NOT resize without retesting in-PDF — LEFTPADDING does not apply to Drawings.
        d = Drawing(36, 36)
        sd = 36; ox = 8; cx2 = ox + 12
        d.add(Ellipse(ox + sd*0.30, sd*0.15, sd*0.45, sd*0.34, fillColor=fg, strokeColor=None))
        for fx, fy, fw, fh in [
            (cx2 - sd*0.13, sd*0.48, sd*0.13, sd*0.30),
            (cx2 + sd*0.01, sd*0.50, sd*0.13, sd*0.32),
            (cx2 + sd*0.15, sd*0.48, sd*0.13, sd*0.30),
        ]:
            d.add(Rect(fx, fy, fw, fh, rx=fw/2, fillColor=fg, strokeColor=None))
    elif icon_name == 'microphone':
        cx=s/2; mw,mh=s*.28,s*.40; mx=cx-mw/2; my=s*.42
        d.add(Rect(mx,my,mw,mh,rx=mw/2,fillColor=fg,strokeColor=None))
        aw=s*.46; ax=cx-aw/2
        d.add(Rect(ax,s*.22,s*.06,s*.24,fillColor=fg,strokeColor=None))
        d.add(Rect(ax+aw-s*.06,s*.22,s*.06,s*.24,fillColor=fg,strokeColor=None))
        arc_pts=[]
        for i in range(13): a=math.pi+math.pi*i/12; arc_pts+=[cx+(aw/2)*math.cos(a),s*.22+s*.12*math.sin(a)]
        for i in range(13): a=math.pi+math.pi*(12-i)/12; arc_pts+=[cx+(aw/2-s*.06)*math.cos(a),s*.22+(s*.12-s*.06)*math.sin(a)]
        d.add(Polygon(arc_pts,fillColor=fg,strokeColor=None))
        d.add(Rect(cx-s*.06,s*.08,s*.12,s*.16,fillColor=fg,strokeColor=None))
        d.add(Rect(cx-s*.18,s*.08,s*.36,s*.05,fillColor=fg,strokeColor=None))
    elif icon_name == 'globe':
        cx=s*.5; cy=s*.22; dot_r=s*.08
        d.add(Circle(cx,cy,dot_r,fillColor=fg,strokeColor=None))
        def arc_ring(cx,cy,ro,ri,a0,a1,steps=18):
            pts=[]
            for i in range(steps+1):
                a=a0+(a1-a0)*i/steps; pts+=[cx+ro*math.cos(a),cy+ro*math.sin(a)]
            for i in range(steps+1):
                a=a1-(a1-a0)*i/steps; pts+=[cx+ri*math.cos(a),cy+ri*math.sin(a)]
            return Polygon(pts,fillColor=fg,strokeColor=None)
        a0=math.radians(210); a1=math.radians(330); thick=s*.09
        for r in [s*.24,s*.40,s*.56]: d.add(arc_ring(cx,cy,r,r-thick,a0,a1))
    elif icon_name == 'person':
        cx=s/2
        d.add(Circle(cx,s*.72,s*.18,fillColor=fg,strokeColor=None))
        d.add(Polygon([cx-s*.28,s*.08,cx-s*.32,s*.52,cx,s*.56,cx+s*.32,s*.52,cx+s*.28,s*.08],fillColor=fg,strokeColor=None))
    elif icon_name == 'beer':
        d.add(Circle(s*.5,s*.78,s*.13,fillColor=fg,strokeColor=None))
        d.add(Polygon([s*.36,s*.18,s*.32,s*.56,s*.5,s*.6,s*.68,s*.56,s*.64,s*.18],fillColor=fg,strokeColor=None))
        d.add(Circle(s*.2,s*.74,s*.10,fillColor=fg,strokeColor=None))
        d.add(Polygon([s*.09,s*.20,s*.06,s*.52,s*.2,s*.55,s*.34,s*.52,s*.31,s*.20],fillColor=fg,strokeColor=None))
        d.add(Circle(s*.8,s*.74,s*.10,fillColor=fg,strokeColor=None))
        d.add(Polygon([s*.69,s*.20,s*.66,s*.52,s*.8,s*.55,s*.94,s*.52,s*.91,s*.20],fillColor=fg,strokeColor=None))
    else:
        d.add(Circle(size/2,size/2,size*.38,fillColor=fg,strokeColor=None))
    return d


class IconFlowable(Flowable):
    def __init__(self, icon_name, size=18, fg=None):
        Flowable.__init__(self); self.icon_name=icon_name; self.size=size; self.fg=fg
        self.width=size; self.height=size
    def draw(self):
        renderPDF.draw(draw_icon(self.icon_name,self.size,self.fg), self.canv, 0, 0)


# ── Box builders ───────────────────────────────────────────────────────────────

def icon_card(icon_name, title, body_text, bg, border_color, icon_fg=None):
    icon_fg=icon_fg or border_color
    icon_d=draw_icon(icon_name,26,icon_fg)
    title_p=Paragraph(f'<font name="Poppins-Bold" size="11">{title}</font>',
        ParagraphStyle('_',fontName='Poppins-Bold',fontSize=11,textColor=border_color,leading=15,spaceBefore=0,spaceAfter=3))
    body_p=Paragraph(body_text,
        ParagraphStyle('_',fontName='Body',fontSize=9.5,textColor=P.ink,leading=13.5,spaceBefore=0,spaceAfter=0))
    t=Table([[icon_d,[title_p,body_p]]],colWidths=[36,CW-56])
    t.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,-1),bg),('BOX',(0,0),(-1,-1),0.75,border_color),
        ('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10),
        ('LEFTPADDING',(0,0),(0,0),5),('RIGHTPADDING',(0,0),(0,0),5),
        ('LEFTPADDING',(1,0),(1,0),8),('RIGHTPADDING',(1,0),(1,0),12),
        ('VALIGN',(0,0),(-1,-1),'MIDDLE')]))
    return t


def callout_box(label, items, bg, border_color, icon_name=None):
    cells=[]
    if icon_name:
        d=draw_icon(icon_name,20,border_color)
        lp=Paragraph(f'<font name="Poppins-Bold" size="10.5">{label}</font>',
            ParagraphStyle('_',fontName='Poppins-Bold',fontSize=10.5,textColor=border_color,leading=14,spaceBefore=0,spaceAfter=6))
        ht=Table([[d,lp]],colWidths=[26,CW-40])
        ht.setStyle(TableStyle([('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0),
            ('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('VALIGN',(0,0),(-1,-1),'MIDDLE')]))
        cells.append(ht)
    else:
        cells.append(Paragraph(f'<font name="Poppins-Bold" size="10.5">{label}</font>',
            ParagraphStyle('_',fontName='Poppins-Bold',fontSize=10.5,textColor=border_color,leading=14,spaceBefore=0,spaceAfter=6)))
    for item in items:
        if isinstance(item,str):
            cells.append(Paragraph(item,ParagraphStyle('_',fontName='Body',fontSize=9.5,textColor=P.ink,leading=13.5,spaceBefore=2,spaceAfter=2)))
        else:
            cells.append(item)
    t=Table([[cells]],colWidths=[CW])
    t.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,-1),bg),('BOX',(0,0),(-1,-1),0.75,border_color),
        ('TOPPADDING',(0,0),(-1,-1),12),('BOTTOMPADDING',(0,0),(-1,-1),12),
        ('LEFTPADDING',(0,0),(-1,-1),14),('RIGHTPADDING',(0,0),(-1,-1),14),
        ('VALIGN',(0,0),(-1,-1),'TOP')]))
    return t


def breathe_box(quote, sub):
    cells=[Paragraph(f'\u201c{quote}\u201d',sBreathe),sp(4),Paragraph(sub,sBrSub)]
    t=Table([[cells]],colWidths=[CW])
    t.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,-1),P.gold_pale),('BOX',(0,0),(-1,-1),0.5,P.sage_pale),
        ('TOPPADDING',(0,0),(-1,-1),18),('BOTTOMPADDING',(0,0),(-1,-1),18),
        ('LEFTPADDING',(0,0),(-1,-1),28),('RIGHTPADDING',(0,0),(-1,-1),28),
        ('VALIGN',(0,0),(-1,-1),'MIDDLE')]))
    return t


def step_card(num, title, body_text):
    np=Paragraph(str(num),ParagraphStyle('_',fontName='Poppins-Bold',fontSize=18,textColor=P.sage_dark,leading=22,alignment=TA_CENTER,spaceBefore=0,spaceAfter=0))
    tp=Paragraph(title,ParagraphStyle('_',fontName='Poppins-Bold',fontSize=11,textColor=P.sage_dark,leading=15,spaceBefore=0,spaceAfter=4))
    bp=Paragraph(body_text,ParagraphStyle('_',fontName='Body',fontSize=9.5,textColor=P.ink,leading=13.5,spaceBefore=0,spaceAfter=0))
    t=Table([[np,[tp,bp]]],colWidths=[36,CW-56])
    t.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(0,0),P.sage_pale),('BACKGROUND',(1,0),(1,0),P.white),
        ('BOX',(0,0),(-1,-1),0.5,P.sage_pale),
        ('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10),
        ('LEFTPADDING',(0,0),(0,0),6),('RIGHTPADDING',(0,0),(0,0),6),
        ('LEFTPADDING',(1,0),(1,0),10),('RIGHTPADDING',(1,0),(1,0),10),
        ('VALIGN',(0,0),(-1,-1),'MIDDLE')]))
    return t


def category_card(icon_name, name, tagline, description, bg, border):
    icon_d=draw_icon(icon_name,28,border)
    np=Paragraph(
        f'<font name="Poppins-Bold" size="12" color="#{P.sage_dark.hexval()[2:]}">{name}</font>'
        f'<font name="Body-Italic" size="9.5" color="#{P.ink_mid.hexval()[2:]}">  \u2014  {tagline}</font>',
        ParagraphStyle('_',fontName='Poppins-Bold',fontSize=12,textColor=P.sage_dark,leading=16,spaceBefore=0,spaceAfter=4))
    bp=Paragraph(description,ParagraphStyle('_',fontName='Body',fontSize=9.5,textColor=P.ink,leading=13.5,spaceBefore=0,spaceAfter=0))
    t=Table([[icon_d,[np,bp]]],colWidths=[42,CW-62])
    t.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,-1),bg),('LINEABOVE',(0,0),(-1,0),2,border),
        ('BOX',(0,0),(-1,-1),0.5,border),
        ('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10),
        ('LEFTPADDING',(0,0),(0,0),7),('RIGHTPADDING',(0,0),(0,0),7),
        ('LEFTPADDING',(1,0),(1,0),10),('RIGHTPADDING',(1,0),(1,0),10),
        ('VALIGN',(0,0),(-1,-1),'TOP')]))
    return t


def tldr(text):
    return callout_box('TL;DR',[text],P.sage_pale,P.sage,'check')


def section_banner(eyebrow_text, title_text):
    ey=Paragraph(eyebrow_text.upper(),ParagraphStyle('_',fontName='Poppins-Bold',fontSize=8,textColor=P.sage,leading=11,spaceBefore=0,spaceAfter=4,characterSpacing=1.5))
    ti=Paragraph(title_text,ParagraphStyle('_',fontName='Poppins-Bold',fontSize=20,textColor=P.sage_dark,leading=26,spaceBefore=0,spaceAfter=0))
    inner=Table([[ey],[ti]],colWidths=[CW-24])
    inner.setStyle(TableStyle([('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0)]))
    outer=Table([[inner]],colWidths=[CW])
    outer.setStyle(TableStyle([
        ('LINEBELOW',(0,0),(-1,-1),1.5,P.sage_pale),
        ('TOPPADDING',(0,0),(-1,-1),14),('BOTTOMPADDING',(0,0),(-1,-1),10),
        ('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0)]))
    return KeepTogether([outer,sp(6)])


def glossary_entry(term, definition):
    return [Paragraph(term,sGlossTerm), Paragraph(definition,sGloss), sp(4)]


# ── Page template ──────────────────────────────────────────────────────────────
def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(P.cream)
    canvas.rect(0,0,W,H,fill=1,stroke=0)
    canvas.setFillColor(P.ink_soft)
    canvas.setFont('Body',8)
    page_num=doc.page
    if page_num>1:
        txt=f"A Beginner's Guide to Kink   \u00b7   Page {page_num}   \u00b7   Bold terms are defined in the Glossary"
        canvas.drawCentredString(W/2,0.5*inch,txt)
        canvas.setStrokeColor(P.sage_pale); canvas.setLineWidth(0.5)
        canvas.line(MARGIN,0.62*inch,W-MARGIN,0.62*inch)
    canvas.restoreState()


# ── Story ──────────────────────────────────────────────────────────────────────
story=[]
def add(*items):
    for item in items:
        if isinstance(item,list): story.extend(item)
        else: story.append(item)

# COVER
story.append(sp(60))
star_d=Drawing(80,80)
star_d.add(Circle(40,40,34,fillColor=P.sage_pale,strokeColor=None))
for i in range(6):
    a=math.pi/2+math.pi*2*i/6
    star_d.add(Circle(40+22*math.cos(a),40+22*math.sin(a),5,fillColor=P.sage,strokeColor=None))
star_d.add(Circle(40,40,10,fillColor=P.sage_dark,strokeColor=None))
cit=Table([[star_d]],colWidths=[CW])
cit.setStyle(TableStyle([('ALIGN',(0,0),(-1,-1),'CENTER'),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),14)]))
story.append(cit)
story.append(Paragraph("A Beginner's Guide to Kink",sCover1))
story.append(sp(8))
story.append(Paragraph("For the curious, the newly-exploring, and everyone who\u2019s wondered \u201cwhat if\u201d",sCover2))
story.append(sp(14))
story.append(HRFlowable(width='60%',thickness=1,color=P.sage_pale,spaceAfter=18,spaceBefore=4,hAlign='CENTER'))
story.append(Paragraph(
    "Starting this exploration at any point in life \u2014 your 20s, your 40s, your 60s \u2014 is completely valid. "
    "This guide assumes no prior knowledge. Every bold term is explained where you first meet it, "
    "and all definitions are collected in the Glossary at the back.",
    ParagraphStyle('CovBody',fontName='Body-Italic',fontSize=10.5,textColor=P.ink_mid,leading=15,alignment=TA_CENTER,spaceBefore=0,spaceAfter=0)))
story.append(sp(20))
story.append(breathe_box("Curious is exactly the right place to start.",
    "You don\u2019t have to figure out who you are today. Just read, notice what sparks, and go at your own pace."))
story.append(PageBreak())

# S1: MYTHS
add(section_banner("Before we begin","Let\u2019s clear the air"),sp(8),
    body("Most people arrive with a few misconceptions \u2014 from movies, jokes, half-remembered headlines, "
         "or just decades of not talking about this stuff openly. "
         "Let\u2019s knock those out first. They\u2019re not true, and they\u2019ll get in the way if we skip them."),sp(14),
    icon_card('check',"Myth: People into kink have something wrong with them",
        "Research consistently shows kink practitioners report lower anxiety, stronger communication skills, "
        "and higher relationship satisfaction than the general population. Curiosity about kink is not a symptom of anything.",
        P.success_pale,P.success),sp(8),
    icon_card('hourglass',"Myth: This is for younger people \u2014 I\u2019m too old to start",
        "There is no age limit on curiosity or self-discovery. Many people begin exploring kink in their 40s, 50s, or later \u2014 "
        "often because they finally have the self-knowledge, the confidence, and the time to do it thoughtfully. "
        "Starting later frequently means starting smarter.",P.success_pale,P.success),sp(8),
    icon_card('scales',"Myth: The Dominant is in charge; the Submissive just goes along",
        "In ethical kink, both people hold real power. The person in the Submissive role can stop everything "
        "at any moment with a single word. Many practitioners say the Submissive actually holds more power, "
        "because the Dominant\u2019s behavior is constrained entirely by consent.",P.success_pale,P.success),sp(8),
    icon_card('heart',"Myth: Kink is primarily about sex",
        "For many people, it\u2019s equally or primarily about trust, vulnerability, emotional intensity, and connection. "
        "Some scenes involve no sex at all. The lines are personal and vary widely.",P.success_pale,P.success),sp(8),
    icon_card('map',"Myth: You have to go all the way in",
        "Most kink is completely modular. Try one small thing, see how it feels, stop or continue. "
        "Plenty of people practice light kink indefinitely and find it satisfying. There\u2019s no finish line.",
        P.success_pale,P.success),sp(14))

# S2: WHAT IS KINK
add(section_banner("The basics","What is kink, exactly?"),sp(8),
    body('The word \u201ckink\u201d is a broad umbrella term for sexual interests, practices, and fantasies '
         'that fall outside what a given culture considers conventional. '
         'There\u2019s no fixed master list \u2014 it\u2019s personal, contextual, and constantly evolving.'),sp(10),
    term_def("BDSM","an acronym for Bondage/Discipline, Dominance/Submission, and Sadism/Masochism "
        "\u2014 the largest and most common cluster of kink activities"),sp(6),
    body("Kink and BDSM overlap significantly but aren\u2019t identical: kink is the broader umbrella, "
         "BDSM is the most common territory within it."),sp(10),
    body("How common is this? More than you\u2019d guess. One major study found nearly half of respondents "
         "had tried at least one BDSM activity. A 2014 study found 65% of women and 53% of men had "
         "fantasized about being sexually dominated. This is not niche."),sp(14),
    tldr("Kink = anything outside conventional sex. BDSM = the most common type. "
         "Both require enthusiastic, ongoing consent. Both are far more common than most people realize."),sp(14))

# S3: CONSENT
add(section_banner("The foundation","Consent: the one non-negotiable"),sp(8),
    body("Before exploring categories, before anything physical, there\u2019s consent. "
         "The kink community is actually more rigorous about consent than most other sexual contexts. "
         "Here\u2019s how they think about it."),sp(14),
    h2("Three frameworks you\u2019ll hear about"),sp(8),
    icon_card('shield',"SSC \u2014 Safe, Sane, and Consensual",
        "All activity should be physically and emotionally safe, done with a clear mind, "
        "and fully agreed upon. The classic framework \u2014 simple and effective for most beginners.",
        P.sage_pale,P.sage),sp(8),
    icon_card('warn',"RACK \u2014 Risk-Aware Consensual Kink",
        "A refinement: some kink carries inherent risk that can\u2019t be fully eliminated. "
        "The goal becomes risk awareness and active agreement, rather than pretending no risk exists. "
        "More honest for certain activities.",P.sage_pale,P.sage,icon_fg=P.amber),sp(8),
    icon_card('mirror',"PRICK \u2014 Personal Responsibility, Informed Consensual Kink",
        "The most individual-centered model. Each person owns their research, their limits, "
        "and their readiness. You show up prepared, informed, and honest.",P.sage_pale,P.sage),sp(18),
    h2("Hard limits vs. soft limits"),sp(8),
    callout_box("Two terms you\u2019ll hear constantly",[
        term_def("Hard limit","an absolute boundary \u2014 a firm no, always, under any circumstances. "
            "Non-negotiable. Never pushed, argued with, or tested."),sp(4),
        term_def("Soft limit","something that makes you hesitate \u2014 might be okay with the right partner, "
            "after more experience, under specific conditions. Not a yes, not a final no."),sp(4),
        body("Making a list of your own limits privately before any conversation with a partner "
             "is one of the most useful things a new person can do."),
    ],P.amber_pale,P.amber,'warn'),sp(18),
    h2("Safewords"),sp(6),
    body("A "+iterm("safeword")+" (a word agreed upon in advance that immediately stops all play) "
         "is the core safety mechanism of kink. It must be agreed upon before anything begins."),sp(10),
    callout_box("The traffic light system \u2014 most beginner-friendly",[
        Paragraph("<font name='Body-Bold' color='#4A8F6A'>\u25cf  GREEN</font> <font name='Body'>  \u2014  All good, keep going</font>",
            ParagraphStyle('_',fontName='Body',fontSize=10,textColor=P.ink,leading=15,spaceBefore=3,spaceAfter=3)),
        Paragraph("<font name='Body-Bold' color='#C49520'>\u25cf  YELLOW</font> <font name='Body'>  \u2014  Slow down, check in with me</font>",
            ParagraphStyle('_',fontName='Body',fontSize=10,textColor=P.ink,leading=15,spaceBefore=3,spaceAfter=3)),
        Paragraph("<font name='Body-Bold' color='#C8714A'>\u25cf  RED</font> <font name='Body'>  \u2014  Stop completely, right now</font>",
            ParagraphStyle('_',fontName='Body',fontSize=10,textColor=P.ink,leading=15,spaceBefore=3,spaceAfter=6)),
        body("If speech might be restricted: agree on a non-verbal signal beforehand "
             "\u2014 tapping out three times, or holding an object and dropping it."),
    ],P.gold_pale,P.gold,'check'),sp(14))

# S4: LANDSCAPE
add(section_banner("What\u2019s out there","The landscape: categories at a glance"),sp(8),
    body("The categories below represent the most common clusters of kink. They overlap, combine, "
         "and most people find themselves curious about two or three rather than just one. "
         "Think of this as a menu, not a checklist."),sp(14),
    category_card('exchange',"Power Exchange","one person leads, one follows",
        "The most widely explored area. One partner takes the guiding role "
        f"({iterm('Dominant')} or {iterm('Top')}), the other follows "
        f"({iterm('Submissive')} or {iterm('Bottom')}). "
        "Can be limited to a single session or an ongoing relationship dynamic. Everything is negotiated in advance.",
        P.sage_pale,P.sage),sp(8),
    category_card('lock',"Bondage & Restraint","physical restriction as part of play",
        "Ranges from holding wrists during sex to elaborate rope work (called "
        f"{iterm('shibari')} or kinbaku in Japanese rope traditions). "
        "The point isn\u2019t restriction itself \u2014 it\u2019s the trust, vulnerability, and sensation that come with it. "
        "Safety note: never leave someone alone while restrained; always have safety scissors within reach.",
        P.terra_pale,P.terra),sp(8),
    category_card('feather',"Sensation Play","exploring the full range of physical feeling",
        "Temperature (ice, warm wax), texture contrast (soft vs. scratchy), blindfolds that heighten everything else. "
        "The idea: sensation isn\u2019t just about pleasure \u2014 it\u2019s about presence and full-body awareness. "
        "One of the easiest areas to try solo first.",P.sage_pale,P.sage),sp(8),
    category_card('hand',"Impact Play","consensual striking",
        "Spanking, paddling, flogging. Covers a huge intensity range. "
        "Safe zones: buttocks, upper thighs, upper back, shoulders. "
        "Avoid: lower back/kidneys, spine, joints, neck, head. Always start lighter than you think you need to.",
        P.terra_pale,P.terra),sp(8),
    category_card('mask',"Role-play & Fantasy","acting out scenarios and characters",
        "Psychological rather than physical. Characters, scenarios, or power dynamics played out verbally or in costume. "
        "Doesn\u2019t need to be elaborate \u2014 even a simple scenario tried once counts. "
        "Discuss the scenario outside of the scene first.",P.sage_pale,P.sage),sp(8),
    category_card('eye',"Voyeurism & Exhibitionism","watching or being watched",
        f"{iterm('Voyeurism')}: arousal from watching. {iterm('Exhibitionism')}: arousal from being watched. "
        "Ranges from mirrors during sex to consensual presence at kink events. "
        "Always requires active, explicit consent from everyone involved.",P.terra_pale,P.terra),sp(8),
    category_card('star',"Fetishes","specific arousal linked to an object or body part",
        "The range is enormous: feet, leather, latex, specific fabrics, clothing. "
        "Common, normal, and only a concern if they cause distress or require non-consenting partners "
        "(which would be abuse, not kink).",P.sage_pale,P.sage),sp(8),
    category_card('candle',"Temperature Play","hot and cold as sensation tools",
        "Ice cubes, warm wax (use soy or low-temp candles only \u2014 never standard household candles near face or hair). "
        "One of the most accessible forms of sensation play to try alone first.",P.terra_pale,P.terra),sp(8),
    category_card('bubble',"Psychological & Verbal Play","words and tone as the medium",
        "Easiest to underestimate. Verbal dynamics \u2014 commanding language, specific words, "
        "praise, or consensual humiliation \u2014 can be among the most emotionally intense forms of kink. "
        f"{iterm('Aftercare')} (emotional support after a scene) is especially important here.",
        P.sage_pale,P.sage),sp(14))

# S5: SOLO
_sp = ParagraphStyle('_solo',fontName='Body',fontSize=9.5,textColor=P.ink,leading=13.5,spaceBefore=0,spaceAfter=6)
add(section_banner("Starting point","Exploring solo first"),sp(8),
    body("If you\u2019ve spent decades in vanilla territory and are only now giving yourself permission to explore \u2014 "
         "welcome. Solo exploration is exactly where to start. Not as a stepping stone to something else, "
         "but as a genuinely valuable stage in itself. One hour of honest private investigation will teach you "
         "more about what you actually respond to than months of tentative conversation. "
         "Everything that comes after is better for it."),sp(14),
    h2("1. Use fantasy as data"),
    body("What comes up repeatedly in your imagination, even when you\u2019re not trying? "
         "Recurring themes aren\u2019t labels or diagnoses \u2014 they\u2019re information. "
         "Keep a private note somewhere. Don\u2019t judge, just observe."),sp(10),
    h2("2. Do the Yes / No / Maybe List"),
    body("A long list of kink activities rated on a simple private scale: "
         f"{ibold('Yes')} (genuinely interested), {ibold('No')} (not for me), {ibold('Maybe')} (open to it with the right context). "
         "Going through one privately, without pressure, is clarifying in ways that are hard to replicate. "
         "Search \u201ckink checklist\u201d or \u201cyes no maybe list\u201d for free templates."),sp(14),
    h2("3. Try low-stakes solo experiments"),
    body("Most kink categories have a solo entry point. The goal isn\u2019t to perform anything \u2014 "
         "it\u2019s to understand your own physical and emotional response before anyone else is involved."),sp(8),
    KeepTogether([callout_box("Solo experiments by category",[
        Paragraph("<font name='Body-Bold'>Sensation play</font>  Run an ice cube along your arm or the back of your neck. Use a scarf for a blindfold while listening to music. Try soft vs. scratchy textures. Notice which sensations hold your attention.",_sp),
        Paragraph("<font name='Body-Bold'>Temperature play</font>  A warm flannel vs. ice. Drip a few drops of cooled (not hot) water onto skin. Low-temp soy candles exist specifically for wax play \u2014 test on your hand first.",_sp),
        Paragraph("<font name='Body-Bold'>Restraint / stillness</font>  Lie completely still for five minutes and notice the psychological response. Not the same as bondage, but tells you whether stillness and restriction feel interesting or anxious.",_sp),
        Paragraph("<font name='Body-Bold'>Fantasy & role framing</font>  Try writing or voice-recording a scenario you find interesting. The act of articulating it \u2014 even privately \u2014 often clarifies what the actual draw is.",_sp),
        Paragraph("<font name='Body-Bold'>Psychological dynamics</font>  Notice how you respond to being told what to do vs. taking charge in everyday life. In conversations, in work, in small decisions. This is quieter data but it matters.",_sp),
    ],P.sage_pale,P.sage,'feather')]),sp(14),
    h2("4. Read before you act"),
    body("The kink community has produced genuinely excellent educational writing. "
         "Reading first means fewer avoidable mistakes and a much clearer vocabulary for what you want."),sp(8),
    KeepTogether([callout_box("Recommended reading",[
        Paragraph(f"{ibold('The New Topping Book')} and {ibold('The New Bottoming Book')}  <font name='Body-Italic'>by Dossie Easton &amp; Janet Hardy</font>\nApproachable, non-prescriptive, widely recommended. Start here.  " + ilink('Amazon \u2192','https://www.amazon.com/dp/1890159360'),
            ParagraphStyle('_',fontName='Body',fontSize=9.5,textColor=P.ink,leading=13.5,spaceBefore=0,spaceAfter=8)),
        Paragraph(f"{ibold('SM 101: A Realistic Introduction')}  <font name='Body-Italic'>by Jay Wiseman</font>\nDetailed, safety-focused, practical.  " + ilink('Amazon \u2192','https://www.amazon.com/dp/0963976389'),
            ParagraphStyle('_',fontName='Body',fontSize=9.5,textColor=P.ink,leading=13.5,spaceBefore=0,spaceAfter=8)),
        Paragraph(f"{ibold('Playing Well with Others')}  <font name='Body-Italic'>by Lee Harrington &amp; Mollena Williams</font>\nAbout community, communication, and navigating kink with other people.  " + ilink('Amazon \u2192','https://www.amazon.com/s?k=Playing+Well+with+Others+Harrington+Williams'),
            ParagraphStyle('_',fontName='Body',fontSize=9.5,textColor=P.ink,leading=13.5,spaceBefore=0,spaceAfter=0)),
    ],P.gold_pale,P.gold,'book')]),sp(14))

# S6: WITH A PARTNER
add(section_banner("The next stage","When you\u2019re ready to involve someone else"),sp(8),
    callout_box("Solo is complete in itself",[
        body("If you\u2019re not in a relationship right now, or if partnered exploration isn\u2019t on your radar, "
             "that\u2019s completely fine. Everything in Sections 5 and 9 (solo phase) is fully valid on its own. "
             "This section is here when and if you want it \u2014 not because it\u2019s the natural endpoint."),
    ],P.sage_pale,P.sage),sp(10),
    callout_box("A note on timing",[
        body("There\u2019s no rule about when to move from solo to partnered exploration. "
             "Some people spend weeks on the solo stage. Some skip it. "
             "The marker isn\u2019t time \u2014 it\u2019s whether you can answer: "
             "what do I want to try, what are my hard limits, and what\u2019s my safeword? "
             "If you can answer those, you\u2019re ready for a conversation."),
    ],P.sage_pale,P.sage),sp(14),
    body("Bringing kink into a relationship requires more explicit communication than most people "
         "are used to. That\u2019s not a drawback \u2014 it\u2019s exactly what makes it safe and actually good."),sp(14),
    step_card(1,"Negotiate before, not during",
        "Consent in kink is established before anything begins, when everyone is clear-headed. "
        "Discuss what\u2019s in bounds, what isn\u2019t, what the safeword is, what aftercare looks like. "
        "This happens outside the bedroom, with normal voices."),sp(8),
    step_card(2,"Start small, on purpose",
        "One new thing at a time. Introducing a single restraint element, or agreeing on one small role-play scenario, "
        "is very different from building an elaborate dynamic. Escalation should always be explicit and agreed upon."),sp(8),
    step_card(3,"Use a safeword, always",
        "Even for mild exploration. Non-negotiable. The traffic light system works: Red = stop, Yellow = slow down. "
        "Agree on it before you start."),sp(8),
    step_card(4,"Aftercare: don\u2019t skip it",
        "Emotional and physical care following a scene. Both people need it \u2014 even the person who was 'in charge.' "
        "Can be cuddling, water and snacks, quiet conversation. Discuss what each person needs before the scene."),sp(8),
    step_card(5,"Debrief later",
        "Hours later, or the next day \u2014 a relaxed conversation about what worked and what didn\u2019t. "
        "This is how good experiences get repeated and problems get caught early."),sp(14),
    KeepTogether([callout_box("A heads-up: Sub Drop and Dom Drop",[
        term_def("Sub drop","a crash in mood, energy, or emotional regulation that can happen hours or days after "
            "an intense scene. Caused by the drop-off of adrenaline, dopamine, and oxytocin. "
            "Symptoms: sadness, irritability, fatigue, or a sense of emptiness."),sp(6),
        term_def("Dom drop","the same phenomenon for the person in the guiding role. Often overlooked. They aren\u2019t unaffected."),sp(6),
        body("Both are completely normal. Both are why aftercare extends beyond the immediate moment. "
             "A follow-up check-in the next day is good practice when you\u2019re starting out."),
    ],P.amber_pale,P.amber,'warn')]),sp(14))

# S7: KINK VS ABUSE
add(section_banner("Knowing the line","Kink vs. abuse: the clear difference"),sp(8),
    body("This is one of the most important things a new person can learn. "
         "The kink community has clear language for this distinction \u2014 and the distinction matters."),sp(12),
    callout_box("The core distinction",[
        Paragraph(f"{ibold('Kink:')}  control is consensually given for a negotiated period, by someone with full power to withdraw it at any moment.",
            ParagraphStyle('_',fontName='Body',fontSize=9.5,textColor=P.ink,leading=13.5,spaceBefore=0,spaceAfter=8)),
        Paragraph(f"{ibold('Abuse:')}  control is taken non-consensually, or consent is manufactured through pressure, manipulation, or coercion.",
            ParagraphStyle('_',fontName='Body',fontSize=9.5,textColor=P.ink,leading=13.5,spaceBefore=0,spaceAfter=8)),
        body("The presence of a kink context does not change this. "
             "If your safeword is ignored \u2014 that is abuse. If your limits are pushed without agreement \u2014 that is abuse."),
    ],P.terra_pale,P.terra,'shield'),sp(14),
    h2("Red flags to watch for",P.terra_dark),
    body("\u2022  Dismissing limits as \u201ctoo uptight\u201d or \u201cyou\u2019ll get used to it\u201d"),
    body("\u2022  Insisting there\u2019s a \u201ctrue\u201d way to be submissive that requires something you\u2019re uncomfortable with"),
    body("\u2022  Using the Dominant role to justify decisions that affect you outside of negotiated play"),
    body("\u2022  Making consent feel like a formality rather than a real, working mechanism"),
    body("\u2022  Continuing after a safeword is used"),sp(14))

# S8: COMMUNITY & RESOURCES
add(section_banner("Next steps","Community & resources"),sp(8),
    body("The single most useful thing you can do after reading this guide is walk into a physical space "
         "with knowledgeable people. If you\u2019re in Western Massachusetts, you have one of the best "
         "beginner-friendly options in New England within reach."),sp(14),
    h2("Start local: B.O.I.N.K. \u2014 Holyoke, MA"),sp(6),
    KeepTogether([callout_box(f'B.O.I.N.K.  \u2014  358 Dwight St, Holyoke, MA  \u00b7  {url("boink-ed.com")}',[
        body("B.O.I.N.K. (Boundless Orgasms In Newfound Knowledge) is a sex-positive education studio "
             "and community space in Holyoke. Founded in 2022, it runs workshops, classes, social events, "
             "and one-on-one coaching. Their explicit mission: \u201cfrom vanilla to the most unique kinks \u2014 "
             "we are here for every side of everyone.\u201d"),sp(6),
        body("It\u2019s LGBTQ-certified, welcoming to all ages and experience levels, and specifically "
             "designed for curious beginners. You don\u2019t need to know anyone to walk in."),
    ],P.terra_pale,P.terra)]),sp(12),
    h2("BOINK classes that map directly to this guide"),sp(8),
    icon_card('flame',f'Hands on Kink  \u2014  {url("boink-ed.com/event")}',
        "BOINK\u2019s regular beginner entry class. General introduction to kink basics in a hands-on, "
        "educational format. The right first class if you\u2019re not sure where to start. "
        "Check the events page for current dates.",P.sage_pale,P.sage),sp(8),
    icon_card('foot',f'Sole Worship: Couples Massage Workshop  \u2014  {url("boink-ed.com/event")}',
        "Sensory and body-focused workshop covering massage technique and sensation. "
        "Low-barrier, beginner-appropriate, and connects directly to the Sensation Play category in this guide. "
        "Appropriate whether you attend solo or with a partner.",P.sage_pale,P.sage),sp(8),
    icon_card('lock',f'Rope 101 & 102 Class  \u2014  {url("boink-ed.com/event")}',
        "BOINK\u2019s foundational rope class covers safety, scene negotiation and consent, "
        "foundational knots, and specific ties \u2014 exactly the progression this guide recommends before "
        "trying restraint with a partner. Book early; sells out.",P.terra_pale,P.terra),sp(8),
    icon_card('clipboard',f'Anatomy of a Scene  \u2014  {url("boink-ed.com/event")}',
        "Building, negotiating, and navigating kink with agency. Maps directly to the "
        "\u201cWith a Partner\u201d section of this guide \u2014 ideal to attend after completing the solo phase.",
        P.sage_pale,P.sage),sp(8),
    icon_card('beer',f'BOINK Munch (monthly)  \u2014  {url("boink-ed.com/event")}',
        "BOINK hosts regular munches \u2014 casual, completely non-sexual social gatherings \u2014 at the studio. "
        "No dress code, no pressure, no play. The right first in-person step.",P.sage_pale,P.sage),sp(8),
    icon_card('microphone','Backdoor BOINK Podcast  \u2014  search on Spotify',
        "BOINK\u2019s podcast covers kink education, community topics, and real conversations about sexuality. "
        "Good listening before your first in-person visit.",P.sage_pale,P.sage),sp(8),
    icon_card('book',f'On-Demand Classes  \u2014  {url("boink-ed.com/ondemand")}',
        "Can\u2019t make a live class? BOINK offers on-demand educational videos you can watch at home, "
        "at your own pace, privately. A natural bridge between reading this guide and attending in person.",
        P.sage_pale,P.sage),sp(14),
    h2("Online communities"),sp(6),
    icon_card('globe',f'FetLife  \u2014  {url("fetlife.com")}',
        "The largest kink social network. Not a hook-up site \u2014 primarily educational groups, "
        "event listings, and community discussion. Search for Western MA groups once you\u2019ve read the guide.",
        P.sage_pale,P.sage),sp(8),
    icon_card('bubble',f'r/BDSMAdvice  \u2014  {url("reddit.com/r/BDSMAdvice")}',
        "A moderated Reddit community with a high signal-to-noise ratio. "
        "Good for specific beginner questions in an anonymous format.",P.sage_pale,P.sage),sp(8),
    icon_card('book',f'Kinkly.com  \u2014  {url("kinkly.com")}',
        "Extensive glossary and educational articles, well-organized for beginners. "
        "Useful reference alongside this guide.",P.sage_pale,P.sage),sp(14),
    h2("Beginner-friendly podcasts"),sp(6),
    body("Audio is a low-pressure way to start learning \u2014 good for commutes, walks, or any time you want "
         "to absorb material privately. The podcasts below are specifically suited to beginners: "
         "accessible tone, no assumed prior knowledge, and strong on consent and communication."),sp(10),
    icon_card('microphone',"Why Are People Into That?!  \u2014  hosted by Tina Horn",
        "Journalist and author Tina Horn interviews practitioners about specific kinks and fetishes in a curious, "
        "non-judgmental format. Each episode unpacks one topic from scratch \u2014 ideal for beginners who want "
        "depth without jargon. Widely regarded as one of the best kink-education podcasts available. "
        f"Website + all platforms: {ilink('tinahorn.net/yapit','https://tinahorn.net/yapit')}",
        P.sage_pale,P.sage),sp(8),
    icon_card('microphone',"American Sex Podcast  \u2014  hosted by Sunny Megatron",
        "AASECT award-winning podcast hosted by certified sex educator Sunny Megatron. "
        "Covers BDSM, kink, consent, and sexuality from an educational standpoint with a warm, inclusive tone. "
        "Strong on consent frameworks and communication \u2014 a natural companion to the Consent section of this guide. "
        f"Website: {ilink('americansexpodcast.com','https://americansexpodcast.com')}",
        P.terra_pale,P.terra),sp(8),
    icon_card('microphone',"Savage Lovecast  \u2014  hosted by Dan Savage",
        "Long-running, widely listened-to advice podcast covering the full range of human sexuality "
        "including kink, BDSM, and non-traditional relationships. Accessible, direct, and beginner-friendly. "
        f"Free episodes at {ilink('savage.love/lovecast','https://savage.love/lovecast/')}; also on Spotify and Apple Podcasts.",
        P.sage_pale,P.sage),sp(14),
    h2("Professional support"),
    body(f'If exploring kink brings up unexpected emotional content \u2014 shame, confusion, past experiences, '
         f'relationship questions \u2014 kink-aware therapists are available and genuinely helpful. '
         f'BOINK also offers one-on-one intimacy coaching sessions '
         f'({ilink("book at boink-ed.com/services","https://boink-ed.com/services")}).'),sp(8),
    icon_card('person',f'AASECT Referral Directory  \u2014  {url("aasect.org/referral-directory")}',
        "Certified sexuality educators, counselors, and therapists, searchable by location.",P.sage_pale,P.sage),sp(8),
    icon_card('person',f'Kink Aware Professionals (KAP)  \u2014  {url("kapprofessionals.org")}',
        "NCSF-maintained directory of therapists, medical professionals, and legal professionals "
        "who are knowledgeable about and sensitive to diverse expressions of sexuality.",P.sage_pale,P.sage),sp(14))

# S9: STARTING PATH
add(section_banner("Your first steps","A suggested starting path"),sp(8),
    body("This is a suggested sequence, not a rulebook. Steps 1\u20135 are entirely solo. "
         "Steps 6\u20137 only apply when you\u2019re ready to involve someone else. "
         "There\u2019s no timeline, and no requirement to reach the end."),sp(10),
    Paragraph("SOLO PHASE \u2014 steps 1 to 5",
        ParagraphStyle('_ph',fontName='Poppins-Bold',fontSize=8,textColor=P.sage,leading=11,spaceBefore=6,spaceAfter=6,characterSpacing=1.2)),
    KeepTogether([
        step_card(1,"Do the Yes / No / Maybe list",
            "No audience, no pressure. Just you and a document. Be honest \u2014 nobody will see it. "
            "Search for free templates online; aim for a list with at least 50 items."),sp(8),
        step_card(2,"Read at least one book",
            "Before anything else. Start with The New Bottoming Book or The New Topping Book \u2014 "
            "whichever direction feels more natural to you. Reading first means fewer avoidable surprises."),sp(8),
        step_card(3,"Try solo sensation experiments",
            "Ice, a blindfold, texture contrast, stillness. "
            "The goal is to understand your own physical response \u2014 what holds your attention, "
            "what feels interesting vs. uncomfortable. See the solo experiments list in Section 5."),sp(8),
        step_card(4,"Write or record a private fantasy",
            "Articulating something \u2014 even just for yourself \u2014 clarifies what the actual draw is. "
            "Not a commitment, not a plan. Just information."),sp(8),
        step_card(5,"Browse community discussions",
            "Read r/BDSMAdvice or FetLife groups without posting. "
            "Learn the vocabulary and how people actually talk about these things. This is its own education."),
    ]),sp(14),
    KeepTogether([
        Paragraph("WHEN YOU\u2019RE READY \u2014 steps 6 and 7",
            ParagraphStyle('_ph2',fontName='Poppins-Bold',fontSize=8,textColor=P.terra,leading=11,spaceBefore=6,spaceAfter=6,characterSpacing=1.2)),
        step_card(6,"Have the conversation before any scene",
            "Outside the bedroom, with normal voices. What do you each want to try? "
            "What are your limits? What\u2019s the safeword? What does aftercare look like for each of you? "
            "One new thing at a time."),sp(8),
        step_card(7,"Debrief afterward \u2014 then check in again the next day",
            "What worked? What didn\u2019t? How do you each feel now? "
            "Sub drop and dom drop can arrive hours later \u2014 a follow-up check-in is good practice "
            "every time when you\u2019re starting out."),sp(14),
        callout_box("If unexpected emotions come up at any stage",[
            body("That\u2019s normal, and it doesn\u2019t mean something went wrong. "
                 "A kink-aware therapist from the AASECT or KAP directory is a legitimate resource, "
                 "not an overreaction. Exploring sexuality honestly sometimes surfaces things that "
                 "benefit from a professional space to process."),
        ],P.sage_pale,P.sage),sp(16),
        breathe_box("There\u2019s no destination here. Curiosity is the whole point.",
            "You\u2019re not trying to arrive anywhere. Just understand yourself more honestly \u2014 "
            "and if you choose to share that with someone, do it safely and well."),
    ]),sp(14))

# GLOSSARY
story.append(CondPageBreak(3.5*inch))
add(section_banner("Reference","Glossary of Terms"),sp(8),
    body("Every term that appears in bold throughout this guide is defined here. "
         "If you encounter an unfamiliar term in the main text, check here for the full definition."),sp(14))

glossary_terms=[
    ("Aftercare","Emotional and physical care provided to all participants after a kink scene. "
        "Can include cuddling, water and snacks, quiet conversation, or simply being present together. "
        "Helps everyone decompress safely and prevents Sub Drop / Dom Drop."),
    ("BDSM","An acronym for Bondage/Discipline, Dominance/Submission, and Sadism/Masochism. "
        "The most common cluster of kink activities. Sometimes used interchangeably with 'kink,' though kink is the broader umbrella term."),
    ("Bottom","The person in the receptive or following role in a scene. Not necessarily permanent \u2014 many people switch roles. See also: Submissive, Switch."),
    ("Bondage","Physical restraint as part of consensual play. Ranges from soft scarves to elaborate rope work. "
        "Safety: never leave a restrained person alone; always have safety scissors within reach."),
    ("Dominant (Dom / Domme)","The partner taking the active, guiding, or leading role in a scene or dynamic. "
        "Not superior to the Submissive \u2014 just occupying a different role within a negotiated framework."),
    ("Dom Drop","A crash in mood or emotional regulation experienced by the Dominant/Top after an intense scene. "
        "The hormonal high of play drops off, leaving fatigue, sadness, or emptiness. Treated the same way as Sub Drop."),
    ("Hard Limit","An absolute, non-negotiable boundary. A hard limit is never pushed, argued with, or tested. When someone states a hard limit, the conversation moves on."),
    ("Impact Play","Consensual striking \u2014 spanking, paddling, flogging, caning. Covers a wide intensity range. Requires knowledge of safe and unsafe zones on the body."),
    ("Kink","An umbrella term for sexual interests, practices, and fantasies outside conventional norms. Highly personal and context-dependent. BDSM is the most common subset."),
    ("Munch","A casual, non-sexual social gathering for kink-curious and kink-identified people. Usually held at a restaurant or bar. The standard first step for in-person community."),
    ("Negotiation","The explicit conversation that happens before any kink activity \u2014 covering what each person wants, what their limits are, what the safeword is, and what aftercare will look like. Non-optional."),
    ("PRICK","Personal Responsibility, Informed Consensual Kink. A consent framework emphasizing individual ownership of one's own education, limits, and safety."),
    ("RACK","Risk-Aware Consensual Kink. A consent framework acknowledging that some kink carries inherent risk, and emphasizing informed agreement rather than assuming all risk can be eliminated."),
    ("Role-play","Acting out characters, scenarios, or power dynamics as part of a sexual or sensory experience. Can be purely verbal, costumed, or elaborately staged."),
    ("Safeword","A pre-agreed word or signal that immediately stops all play. Must be agreed upon before any scene begins. The traffic light system (Red/Yellow/Green) is most common."),
    ("Scene","A defined play session with a beginning, middle, and end. Not necessarily long or elaborate \u2014 even a brief, contained exchange counts."),
    ("Sensation Play","Kink activity centered on exploring physical sensation \u2014 temperature, texture, pressure. Highly accessible; can be explored solo with minimal equipment."),
    ("Shibari","A Japanese rope bondage tradition (also called kinbaku) emphasizing aesthetics, trust, and connection as much as restraint. Requires dedicated study to practice safely."),
    ("Soft Limit","A boundary that isn\u2019t absolute \u2014 something a person hesitates about but might consider under the right conditions. Not a yes, not a no; requires more conversation."),
    ("SSC","Safe, Sane, and Consensual. The classic consent framework: all activity should be physically and emotionally safe, done with a clear mind, and fully agreed upon."),
    ("Sub Drop","A crash in mood, energy, or emotional regulation that can happen hours or days after an intense scene. Caused by the drop-off of adrenaline, dopamine, and oxytocin. Treated with aftercare and follow-up check-ins."),
    ("Submissive (Sub)","The partner in the receptive or following role. Holds genuine power \u2014 including the power to stop the scene at any moment via safeword."),
    ("Switch","Someone who moves between Dominant/Top and Submissive/Bottom roles, either across different partners or different scenes."),
    ("Top","The partner in the active or giving role in a scene. Can be Dominant by temperament, or simply the person executing a technique."),
    ("Vanilla","Conventional, non-kinky sexual activity. Not an insult \u2014 just a descriptor for the other end of the spectrum."),
    ("Yes / No / Maybe List","A self-reflection tool: a long list of kink activities rated on a simple private scale. Useful for understanding your own interests before any conversation with a partner. Many free templates are available online."),
]
for term,defn in glossary_terms:
    add(*glossary_entry(term,defn))

# FURTHER RESOURCES
add(sp(20),
    HRFlowable(width='100%',thickness=1,color=P.sage_pale,spaceAfter=14,spaceBefore=4),
    Paragraph("Further Resources",ParagraphStyle('_',fontName='Poppins-Bold',fontSize=13,
        textColor=P.sage_dark,leading=18,spaceBefore=0,spaceAfter=10)))

resources=[
    ("Local \u2014 Western Massachusetts",[
        ("B.O.I.N.K.","358 Dwight St, Holyoke, MA  \u00b7  boink-ed.com","https://boink-ed.com",
         "Sex-positive education studio and community space. Workshops, classes, munches, coaching, and on-demand content. "
         "Explicitly beginner-welcoming, LGBTQ-certified. Recurring beginner classes: Hands on Kink, "
         "Rope 101 & 102, Anatomy of a Scene, Sole Worship. Check boink-ed.com/event for current schedule."),
        ("Backdoor BOINK Podcast","Search \u201cBackdoor BOINK\u201d on Spotify",None,
         "BOINK\u2019s podcast covering kink education and community topics. Good before your first in-person visit."),
        ("BOINK On-Demand Classes","boink-ed.com/ondemand","https://boink-ed.com/ondemand",
         "Study-at-home video classes. A private, self-paced bridge between reading and attending in person."),
    ]),
    ("Books",[
        ("The New Topping Book",
         "Dossie Easton & Janet Hardy  \u00b7  Amazon / Goodreads",None,
         "The most widely recommended starting point for understanding the guiding role in BDSM. "
         f"{ilink('Amazon','https://www.amazon.com/dp/1890159360')}  \u00b7  {ilink('Goodreads','https://www.goodreads.com/book/show/503943')}"),
        ("The New Bottoming Book",
         "Dossie Easton & Janet Hardy  \u00b7  Amazon / Goodreads",None,
         "Companion volume covering the receptive role. Read both regardless of your inclination. "
         f"{ilink('Amazon','https://www.amazon.com/dp/1890159352')}  \u00b7  {ilink('Goodreads','https://www.goodreads.com/book/show/433500')}"),
        ("SM 101: A Realistic Introduction",
         "Jay Wiseman  \u00b7  Amazon / Goodreads",None,
         "Safety-focused, practical, and detailed. Covers physical techniques and risk management. "
         f"{ilink('Amazon','https://www.amazon.com/dp/0963976389')}  \u00b7  {ilink('Goodreads','https://www.goodreads.com/book/show/493829')}"),
        ("Playing Well with Others",
         "Lee Harrington & Mollena Williams  \u00b7  Amazon / Goodreads",None,
         "Community navigation, communication, and building healthy kink relationships. "
         f"{ilink('Amazon','https://www.amazon.com/s?k=Playing+Well+with+Others+Harrington+Williams')}  \u00b7  {ilink('Goodreads','https://www.goodreads.com/book/show/12127479')}"),
        ("The Ultimate Guide to Kink",
         "Tristan Taormino (ed.)  \u00b7  Amazon",None,
         "Multi-contributor anthology \u2014 specific practices covered in depth by practitioners. "
         f"{ilink('Amazon','https://www.amazon.com/s?k=Ultimate+Guide+to+Kink+Taormino')}"),
        ("When Someone You Love Is Kinky",
         "Dossie Easton & Catherine Liszt  \u00b7  Amazon",None,
         "For partners and family members trying to understand a kinky person in their life. "
         f"{ilink('Amazon','https://www.amazon.com/s?k=When+Someone+You+Love+Is+Kinky+Easton')}"),
    ]),
    ("Online Communities",[
        ("FetLife","fetlife.com","https://fetlife.com",
         "The largest kink social network. Browse community groups and local Western MA event listings."),
        ("r/BDSMAdvice","reddit.com/r/BDSMAdvice","https://reddit.com/r/BDSMAdvice",
         "Moderated and beginner-friendly. Good for specific questions."),
        ("Kinkly Glossary","kinkly.com","https://kinkly.com",
         "Extensive A-Z dictionary of kink terms \u2014 useful reference alongside this guide."),
        ("NCSF","ncsfreedom.org","https://ncsfreedom.org",
         "National Coalition for Sexual Freedom. Advocacy, legal resources, community support."),
    ]),
    ("Podcasts",[
        ("Why Are People Into That?!",
         "Hosted by Tina Horn  \u00b7  tinahorn.net/yapit","https://tinahorn.net/yapit",
         "Journalist Tina Horn interviews practitioners about specific kinks in depth. Curious, non-judgmental, "
         "excellent for beginners. Spotify, Apple Podcasts, and all major platforms."),
        ("American Sex Podcast",
         "Hosted by Sunny Megatron  \u00b7  americansexpodcast.com","https://americansexpodcast.com",
         "AASECT award-winning podcast by certified sex educator Sunny Megatron. Strong on consent, "
         "communication, and BDSM education. Spotify, Apple Podcasts, and all major platforms."),
        ("Savage Lovecast",
         "Hosted by Dan Savage  \u00b7  savage.love/lovecast","https://savage.love/lovecast/",
         "Long-running advice podcast covering the full range of human sexuality. "
         "Free episodes on Spotify and Apple Podcasts; extended ad-free version at savage.love."),
        ("Backdoor BOINK",
         "BOINK\u2019s podcast  \u00b7  search \u201cBackdoor BOINK\u201d on Spotify",None,
         "Local Western MA podcast from the BOINK studio team. Good before your first in-person BOINK visit."),
    ]),
    ("Professional Support",[
        ("AASECT Referral Directory","aasect.org/referral-directory","https://www.aasect.org/referral-directory",
         "Find certified sexuality educators, counselors, and therapists by location."),
        ("Kink Aware Professionals (KAP)","kapprofessionals.org","https://www.kapprofessionals.org",
         "NCSF directory of therapists, medical professionals, and legal professionals."),
        ("BOINK Intimacy Coaching","boink-ed.com/services","https://boink-ed.com/services",
         "One-on-one coaching sessions with BOINK\u2019s certified intimacy coaches. Bookable online."),
    ]),
]

rts=ParagraphStyle('_',fontName='Poppins-Bold',fontSize=10,textColor=P.terra_dark,leading=14,spaceBefore=6,spaceAfter=3)
rns=ParagraphStyle('_',fontName='Body-Bold',fontSize=9.5,textColor=P.ink,leading=13.5,spaceBefore=0,spaceAfter=1)
rss=ParagraphStyle('_',fontName='Body-Italic',fontSize=9,textColor=P.ink_mid,leading=12.5,spaceBefore=0,spaceAfter=1)
rds=ParagraphStyle('_',fontName='Body',fontSize=9,textColor=P.ink,leading=13,spaceBefore=0,spaceAfter=3)

for section_title,entries in resources:
    add(Paragraph(section_title,rts))
    for name,sub,link_url_val,desc in entries:
        if link_url_val:
            sub_para=Paragraph(f'<a href="{link_url_val}"><font name="Body-Italic" color="#{P.terra_dark.hexval()[2:]}">{sub}</font></a>',rss)
        else:
            sub_para=Paragraph(sub,rss)
        add(Paragraph(name,rns),sub_para,Paragraph(desc,rds))

story.append(KeepTogether([
    sp(4),
    HRFlowable(width='100%',thickness=0.5,color=P.sage_pale,spaceAfter=6,spaceBefore=4),
    Paragraph("This guide was prepared as an educational overview for curious adults. "
        "It does not constitute professional therapeutic or medical advice. "
        "If you are processing complex feelings about sexuality or past experiences, "
        "a kink-aware therapist (see KAP or AASECT directories above) is the right resource.",
        ParagraphStyle('_col',fontName='Body-Italic',fontSize=8.5,textColor=P.ink_soft,
            leading=12.5,alignment=TA_CENTER,spaceBefore=0,spaceAfter=5)),
    Paragraph("V008  \u00b7  20260327  \u00b7  Prepared for review \u2014 not for distribution",
        ParagraphStyle('_ver',fontName='Body-Italic',fontSize=8,textColor=P.ink_soft,
            leading=11,alignment=TA_CENTER,spaceBefore=0,spaceAfter=0)),
]))

OUT="/mnt/user-data/outputs/V008 - 20260327 - Beginners Guide to Kink.pdf"
doc=SimpleDocTemplate(OUT,pagesize=letter,leftMargin=MARGIN,rightMargin=MARGIN,
    topMargin=MARGIN,bottomMargin=0.85*inch,
    title="A Beginner's Guide to Kink",author="Claude")
doc.build(story,onFirstPage=on_page,onLaterPages=on_page)
print(f"Done: {OUT}")
