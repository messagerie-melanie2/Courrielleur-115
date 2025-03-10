/***********************************************************

Copyright 1987, 1998  The Open Group

Permission to use, copy, modify, distribute, and sell this software and its
documentation for any purpose is hereby granted without fee, provided that
the above copyright notice appear in all copies and that both that
copyright notice and this permission notice appear in supporting
documentation.

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
OPEN GROUP BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Except as contained in this notice, the name of The Open Group shall not be
used in advertising or otherwise to promote the sale, use or other dealings
in this Software without prior written authorization from The Open Group.

Copyright 1987 by Digital Equipment Corporation, Maynard, Massachusetts.

                        All Rights Reserved

Permission to use, copy, modify, and distribute this software and its
documentation for any purpose and without fee is hereby granted,
provided that the above copyright notice appear in all copies and that
both that copyright notice and this permission notice appear in
supporting documentation, and that the name of Digital not be
used in advertising or publicity pertaining to distribution of the
software without specific, written prior permission.

DIGITAL DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE, INCLUDING
ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS, IN NO EVENT SHALL
DIGITAL BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES OR
ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS
SOFTWARE.

******************************************************************/
/*
 * Copyright © 1998, 2004 Keith Packard
 * Copyright   2007 Red Hat, Inc.
 *
 * Permission to use, copy, modify, distribute, and sell this software and its
 * documentation for any purpose is hereby granted without fee, provided that
 * the above copyright notice appear in all copies and that both that
 * copyright notice and this permission notice appear in supporting
 * documentation, and that the name of Keith Packard not be used in
 * advertising or publicity pertaining to distribution of the software without
 * specific, written prior permission.  Keith Packard makes no
 * representations about the suitability of this software for any purpose.  It
 * is provided "as is" without express or implied warranty.
 *
 * KEITH PACKARD DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE,
 * INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS, IN NO
 * EVENT SHALL KEITH PACKARD BE LIABLE FOR ANY SPECIAL, INDIRECT OR
 * CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE,
 * DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
 * TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

#ifndef PIXMAN_H__
#define PIXMAN_H__

/*
 * Standard integers
 */
#if defined (__SVR4) && defined (__sun)
#  include <sys/int_types.h>
#  include <stdint.h>
#elif defined (__OpenBSD__)
#  include <inttypes.h>
#elif defined (_MSC_VER)
typedef __int8 int8_t;
typedef unsigned __int8 uint8_t;
typedef __int16 int16_t;
typedef unsigned __int16 uint16_t;
typedef __int32 int32_t;
typedef unsigned __int32 uint32_t;
typedef __int64 int64_t;
typedef unsigned __int64 uint64_t;
#else
#  include <stdint.h>
#endif

/*
 * Boolean
 */
typedef int pixman_bool_t;

/*
 * Fixpoint numbers
 */
typedef int64_t			pixman_fixed_32_32_t;
typedef pixman_fixed_32_32_t	pixman_fixed_48_16_t;
typedef uint32_t		pixman_fixed_1_31_t;
typedef uint32_t		pixman_fixed_1_16_t;
typedef int32_t			pixman_fixed_16_16_t;
typedef pixman_fixed_16_16_t	pixman_fixed_t;

#define pixman_fixed_e			((pixman_fixed_t) 1)
#define pixman_fixed_1			(pixman_int_to_fixed(1))
#define pixman_fixed_1_minus_e		(pixman_fixed_1 - pixman_fixed_e)
#define pixman_fixed_to_int(f)		((int) ((f) >> 16))
#define pixman_int_to_fixed(i)		((pixman_fixed_t) ((i) << 16))
#define pixman_fixed_to_double(f)	(double) ((f) / (double) pixman_fixed_1)
#define pixman_double_to_fixed(d)	((pixman_fixed_t) ((d) * 65536.0))
#define pixman_fixed_frac(f)		((f) & pixman_fixed_1_minus_e)
#define pixman_fixed_floor(f)		((f) & ~pixman_fixed_1_minus_e)
#define pixman_fixed_ceil(f)		pixman_fixed_floor ((f) + pixman_fixed_1_minus_e)
#define pixman_fixed_fraction(f)	((f) & pixman_fixed_1_minus_e)
#define pixman_fixed_mod_2(f)		((f) & (pixman_fixed1 | pixman_fixed_1_minus_e))
#define pixman_max_fixed_48_16		((pixman_fixed_48_16_t) 0x7fffffff)
#define pixman_min_fixed_48_16		(-((pixman_fixed_48_16_t) 1 << 31))

/*
 * Misc structs
 */
typedef struct pixman_color pixman_color_t;
typedef struct pixman_point_fixed pixman_point_fixed_t;
typedef struct pixman_line_fixed pixman_line_fixed_t;
typedef struct pixman_vector pixman_vector_t;
typedef struct pixman_transform pixman_transform_t;

struct pixman_color
{
    uint16_t	red;
    uint16_t    green;
    uint16_t    blue;
    uint16_t    alpha;
};

struct pixman_point_fixed
{
    pixman_fixed_t	x;
    pixman_fixed_t	y;
};

struct pixman_line_fixed
{
    pixman_point_fixed_t	p1, p2;
};

struct pixman_vector
{
    pixman_fixed_t	vector[3];
};

struct pixman_transform
{
    pixman_fixed_t	matrix[3][3];
};

pixman_bool_t pixman_transform_point_3d (pixman_transform_t *transform,
					 pixman_vector_t    *vector);

/* Don't blame me, blame XRender */
typedef enum
{
    PIXMAN_REPEAT_NONE,
    PIXMAN_REPEAT_NORMAL,
    PIXMAN_REPEAT_PAD,
    PIXMAN_REPEAT_REFLECT
} pixman_repeat_t;

typedef enum
{
    PIXMAN_FILTER_FAST,
    PIXMAN_FILTER_GOOD,
    PIXMAN_FILTER_BEST,
    PIXMAN_FILTER_NEAREST,
    PIXMAN_FILTER_BILINEAR,
    PIXMAN_FILTER_CONVOLUTION
} pixman_filter_t;

typedef enum
{
    PIXMAN_OP_CLEAR			= 0x00,
    PIXMAN_OP_SRC			= 0x01,
    PIXMAN_OP_DST			= 0x02,
    PIXMAN_OP_OVER			= 0x03,
    PIXMAN_OP_OVER_REVERSE		= 0x04,
    PIXMAN_OP_IN			= 0x05,
    PIXMAN_OP_IN_REVERSE		= 0x06,
    PIXMAN_OP_OUT			= 0x07,
    PIXMAN_OP_OUT_REVERSE		= 0x08,
    PIXMAN_OP_ATOP			= 0x09,
    PIXMAN_OP_ATOP_REVERSE		= 0x0a,
    PIXMAN_OP_XOR			= 0x0b,
    PIXMAN_OP_ADD			= 0x0c,
    PIXMAN_OP_SATURATE			= 0x0d,

    PIXMAN_OP_DISJOINT_CLEAR		= 0x10,
    PIXMAN_OP_DISJOINT_SRC		= 0x11,
    PIXMAN_OP_DISJOINT_DST		= 0x12,
    PIXMAN_OP_DISJOINT_OVER		= 0x13,
    PIXMAN_OP_DISJOINT_OVER_REVERSE	= 0x14,
    PIXMAN_OP_DISJOINT_IN		= 0x15,
    PIXMAN_OP_DISJOINT_IN_REVERSE	= 0x16,
    PIXMAN_OP_DISJOINT_OUT		= 0x17,
    PIXMAN_OP_DISJOINT_OUT_REVERSE	= 0x18,
    PIXMAN_OP_DISJOINT_ATOP		= 0x19,
    PIXMAN_OP_DISJOINT_ATOP_REVERSE	= 0x1a,
    PIXMAN_OP_DISJOINT_XOR		= 0x1b,

    PIXMAN_OP_CONJOINT_CLEAR		= 0x20,
    PIXMAN_OP_CONJOINT_SRC		= 0x21,
    PIXMAN_OP_CONJOINT_DST		= 0x22,
    PIXMAN_OP_CONJOINT_OVER		= 0x23,
    PIXMAN_OP_CONJOINT_OVER_REVERSE	= 0x24,
    PIXMAN_OP_CONJOINT_IN		= 0x25,
    PIXMAN_OP_CONJOINT_IN_REVERSE	= 0x26,
    PIXMAN_OP_CONJOINT_OUT		= 0x27,
    PIXMAN_OP_CONJOINT_OUT_REVERSE	= 0x28,
    PIXMAN_OP_CONJOINT_ATOP		= 0x29,
    PIXMAN_OP_CONJOINT_ATOP_REVERSE	= 0x2a,
    PIXMAN_OP_CONJOINT_XOR		= 0x2b
} pixman_op_t;

/*
 * Regions
 */
typedef struct pixman_region16_data	pixman_region16_data_t;
typedef struct pixman_box16		pixman_box16_t;
typedef struct pixman_rectangle16	pixman_rectangle16_t;
typedef struct pixman_region16		pixman_region16_t;

struct pixman_region16_data {
    long		size;
    long		numRects;
/*  pixman_box16_t	rects[size];   in memory but not explicitly declared */
};

struct pixman_rectangle16
{
    int16_t x, y;
    uint16_t width, height;
};

struct pixman_box16
{
    int16_t x1, y1, x2, y2;
};

struct pixman_region16
{
    pixman_box16_t          extents;
    pixman_region16_data_t  *data;
};

typedef enum
{
    PIXMAN_REGION_OUT,
    PIXMAN_REGION_IN,
    PIXMAN_REGION_PART
} pixman_region_overlap_t;

/* This function exists only to make it possible to preserve the X ABI - it should
 * go away at first opportunity.
 */
void		        pixman_region_set_static_pointers (pixman_box16_t *empty_box,
							   pixman_region16_data_t *empty_data,
							   pixman_region16_data_t *broken_data);

/* creation/destruction */
void                    pixman_region_init              (pixman_region16_t *region);
void                    pixman_region_init_rect         (pixman_region16_t *region,
							 int                x,
							 int                y,
							 unsigned int       width,
							 unsigned int       height);
void                    pixman_region_init_with_extents (pixman_region16_t *region,
							 pixman_box16_t    *extents);
void                    pixman_region_fini              (pixman_region16_t *region);

/* manipulation */
void                    pixman_region_translate  (pixman_region16_t *region,
						  int                x,
						  int                y);
pixman_bool_t           pixman_region_copy       (pixman_region16_t *dest,
						  pixman_region16_t *source);
pixman_bool_t           pixman_region_intersect  (pixman_region16_t *newReg,
						  pixman_region16_t *reg1,
						  pixman_region16_t *reg2);
pixman_bool_t           pixman_region_union      (pixman_region16_t *newReg,
						  pixman_region16_t *reg1,
						  pixman_region16_t *reg2);
pixman_bool_t           pixman_region_union_rect (pixman_region16_t *dest,
						  pixman_region16_t *source,
						  int                x,
						  int                y,
						  unsigned int       width,
						  unsigned int       height);
pixman_bool_t           pixman_region_subtract   (pixman_region16_t *regD,
						  pixman_region16_t *regM,
						  pixman_region16_t *regS);
pixman_bool_t           pixman_region_inverse    (pixman_region16_t *newReg,
						  pixman_region16_t *reg1,
						  pixman_box16_t    *invRect);
pixman_bool_t           pixman_region_contains_point (pixman_region16_t *region,
						      int x, int y, pixman_box16_t *box);
pixman_region_overlap_t pixman_region_contains_rectangle (pixman_region16_t *pixman_region16_t,
							  pixman_box16_t *prect);
pixman_bool_t           pixman_region_not_empty (pixman_region16_t *region);
pixman_box16_t *        pixman_region_extents (pixman_region16_t *region);
int                     pixman_region_n_rects (pixman_region16_t *region);
pixman_box16_t *        pixman_region_rectangles (pixman_region16_t *region,
						  int		    *n_rects);
pixman_bool_t		pixman_region_equal (pixman_region16_t *region1,
					     pixman_region16_t *region2);
pixman_bool_t		pixman_region_selfcheck (pixman_region16_t *region);
void			pixman_region_reset (pixman_region16_t *region, pixman_box16_t *box);
pixman_bool_t		pixman_region_init_rects (pixman_region16_t *region,
						  pixman_box16_t *boxes, int count);

/* Copy / Fill */
pixman_bool_t pixman_blt (uint32_t *src_bits,
			  uint32_t *dst_bits,
			  int src_stride,
			  int dst_stride,
			  int src_bpp,
			  int dst_bpp,
			  int src_x, int src_y,
			  int dst_x, int dst_y,
			  int width, int height);
pixman_bool_t pixman_fill (uint32_t *bits,
			   int stride,
			   int bpp,
			   int x,
			   int y,
			   int width,
			   int height,
			   uint32_t xor);
/*
 * Images
 */
typedef  union pixman_image		pixman_image_t;
typedef struct pixman_indexed		pixman_indexed_t;
typedef struct pixman_gradient_stop	pixman_gradient_stop_t;

typedef uint32_t (* pixman_read_memory_func_t) (const void *src, int size);
typedef void     (* pixman_write_memory_func_t) (void *dst, uint32_t value, int size);

struct pixman_gradient_stop {
    pixman_fixed_t x;
    pixman_color_t color;
};

#define PIXMAN_MAX_INDEXED  256 /* XXX depth must be <= 8 */

#if PIXMAN_MAX_INDEXED <= 256
typedef uint8_t pixman_index_type;
#endif

struct pixman_indexed
{
    pixman_bool_t       color;
    uint32_t		rgba[PIXMAN_MAX_INDEXED];
    pixman_index_type	ent[32768];
};

/*
 * While the protocol is generous in format support, the
 * sample implementation allows only packed RGB and GBR
 * representations for data to simplify software rendering,
 */
#define PIXMAN_FORMAT(bpp,type,a,r,g,b)	(((bpp) << 24) |  \
					 ((type) << 16) | \
					 ((a) << 12) |	  \
					 ((r) << 8) |	  \
					 ((g) << 4) |	  \
					 ((b)))

#define PIXMAN_FORMAT_BPP(f)	(((f) >> 24)       )
#define PIXMAN_FORMAT_TYPE(f)	(((f) >> 16) & 0xff)
#define PIXMAN_FORMAT_A(f)	(((f) >> 12) & 0x0f)
#define PIXMAN_FORMAT_R(f)	(((f) >>  8) & 0x0f)
#define PIXMAN_FORMAT_G(f)	(((f) >>  4) & 0x0f)
#define PIXMAN_FORMAT_B(f)	(((f)      ) & 0x0f)
#define PIXMAN_FORMAT_RGB(f)	(((f)      ) & 0xfff)
#define PIXMAN_FORMAT_VIS(f)	(((f)      ) & 0xffff)
#define PIXMAN_FORMAT_DEPTH(f)	(PIXMAN_FORMAT_A(f) +	\
				 PIXMAN_FORMAT_R(f) +	\
				 PIXMAN_FORMAT_G(f) +	\
				 PIXMAN_FORMAT_B(f))

#define PIXMAN_TYPE_OTHER	0
#define PIXMAN_TYPE_A		1
#define PIXMAN_TYPE_ARGB	2
#define PIXMAN_TYPE_ABGR	3
#define PIXMAN_TYPE_COLOR	4
#define PIXMAN_TYPE_GRAY	5
#define PIXMAN_TYPE_YUY2	6
#define PIXMAN_TYPE_YV12	7

#define PIXMAN_FORMAT_COLOR(f)	(PIXMAN_FORMAT_TYPE(f) & 2)

/* 32bpp formats */
typedef enum {
    PIXMAN_a8r8g8b8 =	PIXMAN_FORMAT(32,PIXMAN_TYPE_ARGB,8,8,8,8),
    PIXMAN_x8r8g8b8 =	PIXMAN_FORMAT(32,PIXMAN_TYPE_ARGB,0,8,8,8),
    PIXMAN_a8b8g8r8 =	PIXMAN_FORMAT(32,PIXMAN_TYPE_ABGR,8,8,8,8),
    PIXMAN_x8b8g8r8 =	PIXMAN_FORMAT(32,PIXMAN_TYPE_ABGR,0,8,8,8),
    
/* 24bpp formats */
    PIXMAN_r8g8b8 =	PIXMAN_FORMAT(24,PIXMAN_TYPE_ARGB,0,8,8,8),
    PIXMAN_b8g8r8 =	PIXMAN_FORMAT(24,PIXMAN_TYPE_ABGR,0,8,8,8),
    
/* 16bpp formats */
    PIXMAN_r5g6b5 =	PIXMAN_FORMAT(16,PIXMAN_TYPE_ARGB,0,5,6,5),
    PIXMAN_b5g6r5 =	PIXMAN_FORMAT(16,PIXMAN_TYPE_ABGR,0,5,6,5),
    
    PIXMAN_a1r5g5b5 =	PIXMAN_FORMAT(16,PIXMAN_TYPE_ARGB,1,5,5,5),
    PIXMAN_x1r5g5b5 =	PIXMAN_FORMAT(16,PIXMAN_TYPE_ARGB,0,5,5,5),
    PIXMAN_a1b5g5r5 =	PIXMAN_FORMAT(16,PIXMAN_TYPE_ABGR,1,5,5,5),
    PIXMAN_x1b5g5r5 =	PIXMAN_FORMAT(16,PIXMAN_TYPE_ABGR,0,5,5,5),
    PIXMAN_a4r4g4b4 =	PIXMAN_FORMAT(16,PIXMAN_TYPE_ARGB,4,4,4,4),
    PIXMAN_x4r4g4b4 =	PIXMAN_FORMAT(16,PIXMAN_TYPE_ARGB,0,4,4,4),
    PIXMAN_a4b4g4r4 =	PIXMAN_FORMAT(16,PIXMAN_TYPE_ABGR,4,4,4,4),
    PIXMAN_x4b4g4r4 =	PIXMAN_FORMAT(16,PIXMAN_TYPE_ABGR,0,4,4,4),
    
/* 8bpp formats */
    PIXMAN_a8 =		PIXMAN_FORMAT(8,PIXMAN_TYPE_A,8,0,0,0),
    PIXMAN_r3g3b2 =	PIXMAN_FORMAT(8,PIXMAN_TYPE_ARGB,0,3,3,2),
    PIXMAN_b2g3r3 =	PIXMAN_FORMAT(8,PIXMAN_TYPE_ABGR,0,3,3,2),
    PIXMAN_a2r2g2b2 =	PIXMAN_FORMAT(8,PIXMAN_TYPE_ARGB,2,2,2,2),
    PIXMAN_a2b2g2r2 =	PIXMAN_FORMAT(8,PIXMAN_TYPE_ABGR,2,2,2,2),
    
    PIXMAN_c8 =		PIXMAN_FORMAT(8,PIXMAN_TYPE_COLOR,0,0,0,0),
    PIXMAN_g8 =		PIXMAN_FORMAT(8,PIXMAN_TYPE_GRAY,0,0,0,0),
    
    PIXMAN_x4a4 =	PIXMAN_FORMAT(8,PIXMAN_TYPE_A,4,0,0,0),
    
    PIXMAN_x4c4 =	PIXMAN_FORMAT(8,PIXMAN_TYPE_COLOR,0,0,0,0),
    PIXMAN_x4g4 =	PIXMAN_FORMAT(8,PIXMAN_TYPE_GRAY,0,0,0,0),
    
/* 4bpp formats */
    PIXMAN_a4 =		PIXMAN_FORMAT(4,PIXMAN_TYPE_A,4,0,0,0),
    PIXMAN_r1g2b1 =	PIXMAN_FORMAT(4,PIXMAN_TYPE_ARGB,0,1,2,1),
    PIXMAN_b1g2r1 =	PIXMAN_FORMAT(4,PIXMAN_TYPE_ABGR,0,1,2,1),
    PIXMAN_a1r1g1b1 =	PIXMAN_FORMAT(4,PIXMAN_TYPE_ARGB,1,1,1,1),
    PIXMAN_a1b1g1r1 =	PIXMAN_FORMAT(4,PIXMAN_TYPE_ABGR,1,1,1,1),
    
    PIXMAN_c4 =		PIXMAN_FORMAT(4,PIXMAN_TYPE_COLOR,0,0,0,0),
    PIXMAN_g4 =		PIXMAN_FORMAT(4,PIXMAN_TYPE_GRAY,0,0,0,0),
    
/* 1bpp formats */
    PIXMAN_a1 =		PIXMAN_FORMAT(1,PIXMAN_TYPE_A,1,0,0,0),
    
    PIXMAN_g1 =		PIXMAN_FORMAT(1,PIXMAN_TYPE_GRAY,0,0,0,0),

/* YUV formats */
    PIXMAN_yuy2 =	PIXMAN_FORMAT(16,PIXMAN_TYPE_YUY2,0,0,0,0),
    PIXMAN_yv12 =	PIXMAN_FORMAT(12,PIXMAN_TYPE_YV12,0,0,0,0)
} pixman_format_code_t;

/* Constructors */
pixman_image_t *pixman_image_create_solid_fill       (pixman_color_t               *color);
pixman_image_t *pixman_image_create_linear_gradient  (pixman_point_fixed_t         *p1,
						      pixman_point_fixed_t         *p2,
						      const pixman_gradient_stop_t *stops,
						      int                           n_stops);
pixman_image_t *pixman_image_create_radial_gradient  (pixman_point_fixed_t         *inner,
						      pixman_point_fixed_t         *outer,
						      pixman_fixed_t                inner_radius,
						      pixman_fixed_t                outer_radius,
						      const pixman_gradient_stop_t *stops,
						      int                           n_stops);
pixman_image_t *pixman_image_create_conical_gradient (pixman_point_fixed_t         *center,
						      pixman_fixed_t                angle,
						      const pixman_gradient_stop_t *stops,
						      int                           n_stops);
pixman_image_t *pixman_image_create_bits             (pixman_format_code_t          format,
						      int                           width,
						      int                           height,
						      uint32_t                     *bits,
						      int                           rowstride_bytes);

/* Destructor */
pixman_image_t *pixman_image_ref                     (pixman_image_t               *image);
pixman_bool_t   pixman_image_unref                   (pixman_image_t               *image);


/* Set properties */
pixman_bool_t   pixman_image_set_clip_region         (pixman_image_t               *image,
						      pixman_region16_t            *region);
void		pixman_image_set_has_client_clip     (pixman_image_t               *image,
						      pixman_bool_t		    clien_clip);
pixman_bool_t   pixman_image_set_transform           (pixman_image_t               *image,
						      const pixman_transform_t     *transform);
void            pixman_image_set_repeat              (pixman_image_t               *image,
						      pixman_repeat_t               repeat);
pixman_bool_t   pixman_image_set_filter              (pixman_image_t               *image,
						      pixman_filter_t               filter,
						      const pixman_fixed_t         *filter_params,
						      int                           n_filter_params);
void            pixman_image_set_filter_params       (pixman_image_t               *image,
						      pixman_fixed_t               *params,
						      int                           n_params);
void		pixman_image_set_source_clipping     (pixman_image_t		   *image,
						      pixman_bool_t                 source_clipping);
void            pixman_image_set_alpha_map           (pixman_image_t               *image,
						      pixman_image_t               *alpha_map,
						      int16_t                       x,
						      int16_t                       y);
void            pixman_image_set_component_alpha     (pixman_image_t               *image,
						      pixman_bool_t                 component_alpha);
void		pixman_image_set_accessors	     (pixman_image_t		   *image,
						      pixman_read_memory_func_t	    read_func,
						      pixman_write_memory_func_t    write_func);
void		pixman_image_set_indexed	     (pixman_image_t		   *image,
						      const pixman_indexed_t	   *indexed);
uint32_t       *pixman_image_get_data                (pixman_image_t               *image);
int		pixman_image_get_width               (pixman_image_t               *image);
int             pixman_image_get_height              (pixman_image_t               *image);
int		pixman_image_get_stride              (pixman_image_t               *image);
int		pixman_image_get_depth               (pixman_image_t		   *image);
pixman_bool_t	pixman_image_fill_rectangles	     (pixman_op_t		    op,
						      pixman_image_t		   *image,
						      pixman_color_t		   *color,
						      int			    n_rects,
						      const pixman_rectangle16_t	   *rects);

/* Composite */
pixman_bool_t   pixman_compute_composite_region (pixman_region16_t *	pRegion,
						 pixman_image_t *	pSrc,
						 pixman_image_t *	pMask,
						 pixman_image_t *	pDst,
						 int16_t		xSrc,
						 int16_t		ySrc,
						 int16_t		xMask,
						 int16_t		yMask,
						 int16_t		xDst,
						 int16_t		yDst,
						 uint16_t		width,
						 uint16_t		height);
void		pixman_image_composite          (pixman_op_t		    op,
						 pixman_image_t		   *src,
						 pixman_image_t               *mask,
						 pixman_image_t               *dest,
						 int16_t                       src_x,
						 int16_t                       src_y,
						 int16_t                       mask_x,
						 int16_t                       mask_y,
						 int16_t                       dest_x,
						 int16_t                       dest_y,
						 uint16_t                      width,
						 uint16_t                      height);

/*
 * Trapezoids
 */
typedef struct pixman_edge pixman_edge_t;
typedef struct pixman_trapezoid pixman_trapezoid_t;
typedef struct pixman_trap pixman_trap_t;
typedef struct pixman_span_fix pixman_span_fix_t;

/*
 * An edge structure.  This represents a single polygon edge
 * and can be quickly stepped across small or large gaps in the
 * sample grid
 */
struct pixman_edge
{
    pixman_fixed_t	x;
    pixman_fixed_t	e;
    pixman_fixed_t   stepx;
    pixman_fixed_t   signdx;
    pixman_fixed_t   dy;
    pixman_fixed_t   dx;

    pixman_fixed_t   stepx_small;
    pixman_fixed_t   stepx_big;
    pixman_fixed_t   dx_small;
    pixman_fixed_t   dx_big;
};

struct pixman_trapezoid
{
    pixman_fixed_t  top, bottom;
    pixman_line_fixed_t	left, right;
};


/* whether 't' is a well defined not obviously empty trapezoid */
#define pixman_trapezoid_valid(t)				\
    ((t)->left.p1.y != (t)->left.p2.y &&			   \
     (t)->right.p1.y != (t)->right.p2.y &&			   \
     (int) ((t)->bottom - (t)->top) > 0)

struct pixman_span_fix
{
    pixman_fixed_t	l, r, y;
};

struct pixman_trap
{
    pixman_span_fix_t	top, bot;
};

pixman_fixed_t pixman_sample_ceil_y        (pixman_fixed_t       y,
					    int                  bpp);
pixman_fixed_t pixman_sample_floor_y       (pixman_fixed_t       y,
					    int                  bpp);
void           pixman_edge_step            (pixman_edge_t       *e,
					    int                  n);
void           pixman_edge_init            (pixman_edge_t       *e,
					    int                  bpp,
					    pixman_fixed_t       y_start,
					    pixman_fixed_t       x_top,
					    pixman_fixed_t       y_top,
					    pixman_fixed_t       x_bot,
					    pixman_fixed_t       y_bot);
void           pixman_line_fixed_edge_init (pixman_edge_t       *e,
					    int                  bpp,
					    pixman_fixed_t       y,
					    const pixman_line_fixed_t *line,
					    int                  x_off,
					    int                  y_off);
void           pixman_rasterize_edges      (pixman_image_t      *image,
					    pixman_edge_t       *l,
					    pixman_edge_t       *r,
					    pixman_fixed_t       t,
					    pixman_fixed_t       b);
void           pixman_add_traps            (pixman_image_t      *image,
					    int16_t              x_off,
					    int16_t              y_off,
					    int                  ntrap,
					    pixman_trap_t       *traps);
void	       pixman_add_trapezoids       (pixman_image_t      *image,
					    int16_t              x_off,
					    int                  y_off,
					    int                  ntraps,
					    const pixman_trapezoid_t  *traps);
void           pixman_rasterize_trapezoid  (pixman_image_t      *image,
					    const pixman_trapezoid_t  *trap,
					    int                  x_off,
					    int                  y_off);


#endif /* PIXMAN_H__ */
