/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is the Mozilla SVG project.
 *
 * The Initial Developer of the Original Code is IBM Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2005
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either of the GNU General Public License Version 2 or later (the "GPL"),
 * or the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

#include "nsSVGFilterFrame.h"
#include "nsIDocument.h"
#include "nsISVGValueUtils.h"
#include "nsSVGMatrix.h"
#include "nsSVGOuterSVGFrame.h"
#include "nsISVGFilter.h"
#include "nsGkAtoms.h"
#include "nsSVGUtils.h"
#include "nsSVGFilterElement.h"
#include "nsSVGFilterInstance.h"
#include "nsSVGFilters.h"
#include "gfxASurface.h"
#include "gfxContext.h"
#include "gfxImageSurface.h"

nsIFrame*
NS_NewSVGFilterFrame(nsIPresShell* aPresShell, nsIContent* aContent, nsStyleContext* aContext)
{
  nsCOMPtr<nsIDOMSVGFilterElement> filter = do_QueryInterface(aContent);
  if (!filter) {
    NS_ERROR("Can't create frame! Content is not an SVG filter");
    return nsnull;
  }

  return new (aPresShell) nsSVGFilterFrame(aContext);
}

nsIContent *
NS_GetSVGFilterElement(nsIURI *aURI, nsIContent *aContent)
{
  nsIContent* content = nsContentUtils::GetReferencedElement(aURI, aContent);

  nsCOMPtr<nsIDOMSVGFilterElement> filter = do_QueryInterface(content);
  if (filter)
    return content;

  return nsnull;
}

void
nsSVGFilterFrame::FilterFailCleanup(nsSVGRenderState *aContext,
                                    nsISVGChildFrame *aTarget)
{
  aTarget->SetOverrideCTM(nsnull);
  aTarget->SetMatrixPropagation(PR_TRUE);
  aTarget->NotifyCanvasTMChanged(PR_TRUE);
  aTarget->PaintSVG(aContext, nsnull);
}

nsresult
nsSVGFilterFrame::FilterPaint(nsSVGRenderState *aContext,
                              nsISVGChildFrame *aTarget)
{
  nsCOMPtr<nsIDOMSVGFilterElement> aFilter = do_QueryInterface(mContent);
  NS_ASSERTION(aFilter, "Wrong content element (not filter)");

  PRUint32 requirements = 0;
  PRUint32 count = mContent->GetChildCount();
  for (PRUint32 i=0; i<count; ++i) {
    nsIContent* child = mContent->GetChildAt(i);

    nsCOMPtr<nsISVGFilter> filter = do_QueryInterface(child);
    if (filter) {
      PRUint32 tmp;
      filter->GetRequirements(&tmp);
      requirements |= tmp;
    }
  }

  // check for source requirements that we don't support yet
  if (requirements & ~(NS_FE_SOURCEGRAPHIC | NS_FE_SOURCEALPHA)) {
#ifdef DEBUG_tor
    if (requirements & ~(NS_FE_SOURCEGRAPHIC | NS_FE_SOURCEALPHA))
      fprintf(stderr, "FilterFrame: unimplemented source requirement\n");
#endif
    aTarget->PaintSVG(aContext, nsnull);
    return NS_OK;
  }

  nsIFrame *frame;
  CallQueryInterface(aTarget, &frame);

  nsCOMPtr<nsIDOMSVGMatrix> ctm = nsSVGUtils::GetCanvasTM(frame);

  nsSVGElement *target = static_cast<nsSVGElement*>(frame->GetContent());

  aTarget->SetMatrixPropagation(PR_FALSE);
  aTarget->NotifyCanvasTMChanged(PR_TRUE);

  nsSVGFilterElement *filter = static_cast<nsSVGFilterElement*>(mContent);

  float x, y, width, height;
  nsCOMPtr<nsIDOMSVGRect> bbox;
  aTarget->GetBBox(getter_AddRefs(bbox));

  nsSVGLength2 *tmpX, *tmpY, *tmpWidth, *tmpHeight;
  tmpX = &filter->mLengthAttributes[nsSVGFilterElement::X];
  tmpY = &filter->mLengthAttributes[nsSVGFilterElement::Y];
  tmpWidth = &filter->mLengthAttributes[nsSVGFilterElement::WIDTH];
  tmpHeight = &filter->mLengthAttributes[nsSVGFilterElement::HEIGHT];

  PRUint16 units =
    filter->mEnumAttributes[nsSVGFilterElement::FILTERUNITS].GetAnimValue();

  if (units == nsIDOMSVGUnitTypes::SVG_UNIT_TYPE_OBJECTBOUNDINGBOX) {
    if (!bbox)
      return NS_OK;

    bbox->GetX(&x);
    x += nsSVGUtils::ObjectSpace(bbox, tmpX);
    bbox->GetY(&y);
    y += nsSVGUtils::ObjectSpace(bbox, tmpY);
    width = nsSVGUtils::ObjectSpace(bbox, tmpWidth);
    height = nsSVGUtils::ObjectSpace(bbox, tmpHeight);
  } else {
    x = nsSVGUtils::UserSpace(target, tmpX);
    y = nsSVGUtils::UserSpace(target, tmpY);
    width = nsSVGUtils::UserSpace(target, tmpWidth);
    height = nsSVGUtils::UserSpace(target, tmpHeight);
  }
  
  PRBool resultOverflows;
  gfxIntSize filterRes;

  if (mContent->HasAttr(kNameSpaceID_None, nsGkAtoms::filterRes)) {
    PRInt32 filterResX, filterResY;
    filter->GetAnimatedIntegerValues(&filterResX, &filterResY, nsnull);

    filterRes =
      nsSVGUtils::ConvertToSurfaceSize(gfxSize(filterResX, filterResY),
                                       &resultOverflows);
  } else {
    float scale = nsSVGUtils::MaxExpansion(ctm);
#ifdef DEBUG_tor
    fprintf(stderr, "scale: %f\n", scale);
#endif

    filterRes =
      nsSVGUtils::ConvertToSurfaceSize(gfxSize(width, height) * scale,
                                       &resultOverflows);
  }


  // 0 disables rendering, < 0 is error
  if (filterRes.width <= 0 || filterRes.height <= 0)
    return NS_OK;

#ifdef DEBUG_tor
  fprintf(stderr, "filter bbox: %f,%f  %fx%f\n", x, y, width, height);
  fprintf(stderr, "filterRes: %u %u\n", filterRes.width, filterRes.height);
#endif

  nsCOMPtr<nsIDOMSVGMatrix> filterTransform;
  NS_NewSVGMatrix(getter_AddRefs(filterTransform),
                  filterRes.width / width,      0.0f,
                  0.0f,                         filterRes.height / height,
                  -x * filterRes.width / width, -y * filterRes.height / height);
  aTarget->SetOverrideCTM(filterTransform);
  aTarget->NotifyCanvasTMChanged(PR_TRUE);

  // paint the target geometry
  nsRefPtr<gfxImageSurface> tmpSurface =
    new gfxImageSurface(filterRes, gfxASurface::ImageFormatARGB32);
  if (!tmpSurface || tmpSurface->CairoStatus()) {
    FilterFailCleanup(aContext, aTarget);
    return NS_OK;
  }

  gfxContext tmpContext(tmpSurface);
  nsSVGRenderState tmpState(&tmpContext);

  tmpContext.SetOperator(gfxContext::OPERATOR_CLEAR);
  tmpContext.Paint();
  tmpContext.SetOperator(gfxContext::OPERATOR_OVER);

  aTarget->PaintSVG(&tmpState, nsnull);

  PRUint16 primitiveUnits =
    filter->mEnumAttributes[nsSVGFilterElement::PRIMITIVEUNITS].GetAnimValue();

  nsSVGFilterInstance instance(target, bbox,
                               x, y, width, height,
                               filterRes.width, filterRes.height,
                               primitiveUnits);
  nsSVGFilterInstance::ColorModel 
    colorModel(nsSVGFilterInstance::ColorModel::SRGB,
               nsSVGFilterInstance::ColorModel::PREMULTIPLIED);

  if (requirements & NS_FE_SOURCEALPHA) {
    nsRefPtr<gfxImageSurface> alpha =
      new gfxImageSurface(filterRes, gfxASurface::ImageFormatARGB32);

    if (!alpha || alpha->CairoStatus()) {
      FilterFailCleanup(aContext, aTarget);
      return NS_OK;
    }

    PRUint8 *data = tmpSurface->Data();
    PRUint8 *alphaData = alpha->Data();
    PRUint32 stride = tmpSurface->Stride();

    for (PRInt32 yy = 0; yy < filterRes.height; yy++)
      for (PRInt32 xx = 0; xx < filterRes.width; xx++) {
        alphaData[stride*yy + 4*xx + GFX_ARGB32_OFFSET_B] = 0;
        alphaData[stride*yy + 4*xx + GFX_ARGB32_OFFSET_G] = 0;
        alphaData[stride*yy + 4*xx + GFX_ARGB32_OFFSET_R] = 0;
        alphaData[stride*yy + 4*xx + GFX_ARGB32_OFFSET_A] =
          data[stride*yy + 4*xx + GFX_ARGB32_OFFSET_A];
    }

    instance.DefineImage(NS_LITERAL_STRING("SourceAlpha"), alpha,
                         nsRect(0, 0, filterRes.width, filterRes.height),
                         colorModel);
  }

  // this always needs to be defined last because the default image
  // for the first filter element is supposed to be SourceGraphic
  instance.DefineImage(NS_LITERAL_STRING("SourceGraphic"), tmpSurface,
                       nsRect(0, 0, filterRes.width, filterRes.height),
                       colorModel);

  for (PRUint32 k=0; k<count; ++k) {
    nsIContent* child = mContent->GetChildAt(k);

    nsCOMPtr<nsISVGFilter> filter = do_QueryInterface(child);
    if (filter && NS_FAILED(filter->Filter(&instance))) {
      FilterFailCleanup(aContext, aTarget);
      return NS_OK;
    }
  }

  nsRect filterRect;
  nsRefPtr<gfxImageSurface> filterSurface;

  instance.LookupImage(NS_LITERAL_STRING(""),
                       getter_AddRefs(filterSurface), &filterRect, colorModel);

  if (!filterSurface) {
    FilterFailCleanup(aContext, aTarget);
    return NS_OK;
  }

  nsCOMPtr<nsIDOMSVGMatrix> scale, fini;
  NS_NewSVGMatrix(getter_AddRefs(scale),
                  width / filterRes.width, 0.0f,
                  0.0f, height / filterRes.height,
                  x, y);

  ctm->Multiply(scale, getter_AddRefs(fini));

  nsSVGUtils::CompositeSurfaceMatrix(aContext->GetGfxContext(),
                                     filterSurface, fini, 1.0);

  aTarget->SetOverrideCTM(nsnull);
  aTarget->SetMatrixPropagation(PR_TRUE);
  aTarget->NotifyCanvasTMChanged(PR_TRUE);

  return NS_OK;
}

nsRect
nsSVGFilterFrame::GetInvalidationRegion(nsIFrame *aTarget)
{
  nsSVGElement *targetContent =
    static_cast<nsSVGElement*>(aTarget->GetContent());
  nsISVGChildFrame *svg;

  nsCOMPtr<nsIDOMSVGMatrix> ctm = nsSVGUtils::GetCanvasTM(aTarget);

  CallQueryInterface(aTarget, &svg);

  nsSVGFilterElement *filter = static_cast<nsSVGFilterElement*>(mContent);

  PRUint16 type =
    filter->mEnumAttributes[nsSVGFilterElement::FILTERUNITS].GetAnimValue();

  float x, y, width, height;
  nsCOMPtr<nsIDOMSVGRect> bbox;

  svg->SetMatrixPropagation(PR_FALSE);
  svg->NotifyCanvasTMChanged(PR_TRUE);

  svg->GetBBox(getter_AddRefs(bbox));

  svg->SetMatrixPropagation(PR_TRUE);
  svg->NotifyCanvasTMChanged(PR_TRUE);

  nsSVGLength2 *tmpX, *tmpY, *tmpWidth, *tmpHeight;
  tmpX = &filter->mLengthAttributes[nsSVGFilterElement::X];
  tmpY = &filter->mLengthAttributes[nsSVGFilterElement::Y];
  tmpWidth = &filter->mLengthAttributes[nsSVGFilterElement::WIDTH];
  tmpHeight = &filter->mLengthAttributes[nsSVGFilterElement::HEIGHT];

  if (type == nsIDOMSVGUnitTypes::SVG_UNIT_TYPE_OBJECTBOUNDINGBOX) {
    if (!bbox)
      return nsRect();

    bbox->GetX(&x);
    x += nsSVGUtils::ObjectSpace(bbox, tmpX);
    bbox->GetY(&y);
    y += nsSVGUtils::ObjectSpace(bbox, tmpY);
    width = nsSVGUtils::ObjectSpace(bbox, tmpWidth);
    height = nsSVGUtils::ObjectSpace(bbox, tmpHeight);
  } else {
    x = nsSVGUtils::UserSpace(targetContent, tmpX);
    y = nsSVGUtils::UserSpace(targetContent, tmpY);
    width = nsSVGUtils::UserSpace(targetContent, tmpWidth);
    height = nsSVGUtils::UserSpace(targetContent, tmpHeight);
  }

#ifdef DEBUG_tor
  fprintf(stderr, "invalidate box: %f,%f %fx%f\n", x, y, width, height);
#endif

  // transform back
  float xx[4], yy[4];
  xx[0] = x;          yy[0] = y;
  xx[1] = x + width;  yy[1] = y;
  xx[2] = x + width;  yy[2] = y + height;
  xx[3] = x;          yy[3] = y + height;

  nsSVGUtils::TransformPoint(ctm, &xx[0], &yy[0]);
  nsSVGUtils::TransformPoint(ctm, &xx[1], &yy[1]);
  nsSVGUtils::TransformPoint(ctm, &xx[2], &yy[2]);
  nsSVGUtils::TransformPoint(ctm, &xx[3], &yy[3]);

  float xmin, xmax, ymin, ymax;
  xmin = xmax = xx[0];
  ymin = ymax = yy[0];
  for (int i=1; i<4; i++) {
    if (xx[i] < xmin)
      xmin = xx[i];
    if (yy[i] < ymin)
      ymin = yy[i];
    if (xx[i] > xmax)
      xmax = xx[i];
    if (yy[i] > ymax)
      ymax = yy[i];
  }

#ifdef DEBUG_tor
  fprintf(stderr, "xform bound: %f %f  %f %f\n", xmin, ymin, xmax, ymax);
#endif

  return nsSVGUtils::ToBoundingPixelRect(xmin, ymin, xmax, ymax);
}

nsIAtom *
nsSVGFilterFrame::GetType() const
{
  return nsGkAtoms::svgFilterFrame;
}

// ----------------------------------------------------------------
// nsSVGFilterInstance

float
nsSVGFilterInstance::GetPrimitiveLength(nsSVGLength2 *aLength)
{
  float value;
  if (mPrimitiveUnits == nsIDOMSVGUnitTypes::SVG_UNIT_TYPE_OBJECTBOUNDINGBOX)
    value = nsSVGUtils::ObjectSpace(mTargetBBox, aLength);
  else
    value = nsSVGUtils::UserSpace(mTarget, aLength);

  switch (aLength->GetCtxType()) {
  case nsSVGUtils::X:
    return value * mFilterResX / mFilterWidth;
  case nsSVGUtils::Y:
    return value * mFilterResY / mFilterHeight;
  case nsSVGUtils::XY:
  default:
    return value *
      sqrt(float(mFilterResX * mFilterResX + mFilterResY * mFilterResY)) /
      sqrt(mFilterWidth * mFilterWidth + mFilterHeight * mFilterHeight);
  }
}

void
nsSVGFilterInstance::GetFilterSubregion(
  nsIContent *aFilter,
  nsRect defaultRegion,
  nsRect *result)
{
  nsSVGFE *fE = static_cast<nsSVGFE*>(aFilter);
  nsSVGLength2 *tmpX, *tmpY, *tmpWidth, *tmpHeight;

  tmpX = &fE->mLengthAttributes[nsSVGFE::X];
  tmpY = &fE->mLengthAttributes[nsSVGFE::Y];
  tmpWidth = &fE->mLengthAttributes[nsSVGFE::WIDTH];
  tmpHeight = &fE->mLengthAttributes[nsSVGFE::HEIGHT];

  float x, y, width, height;

  if (mPrimitiveUnits == nsIDOMSVGUnitTypes::SVG_UNIT_TYPE_OBJECTBOUNDINGBOX) {
    x      = nsSVGUtils::ObjectSpace(mTargetBBox, tmpX);
    y      = nsSVGUtils::ObjectSpace(mTargetBBox, tmpY);
    width  = nsSVGUtils::ObjectSpace(mTargetBBox, tmpWidth);
    height = nsSVGUtils::ObjectSpace(mTargetBBox, tmpHeight);
  } else {
    x      = nsSVGUtils::UserSpace(mTarget, tmpX);
    y      = nsSVGUtils::UserSpace(mTarget, tmpY);
    width  = nsSVGUtils::UserSpace(mTarget, tmpWidth);
    height = nsSVGUtils::UserSpace(mTarget, tmpHeight);
  }

#ifdef DEBUG_tor
  fprintf(stderr, "GFS[1]: %f %f %f %f\n", x, y, width, height);
#endif

  nsRect filter, region;

  filter.x = 0;
  filter.y = 0;
  filter.width = mFilterResX;
  filter.height = mFilterResY;

  region.x      = (x - mFilterX) * mFilterResX / mFilterWidth;
  region.y      = (y - mFilterY) * mFilterResY / mFilterHeight;
  region.width  =          width * mFilterResX / mFilterWidth;
  region.height =         height * mFilterResY / mFilterHeight;

#ifdef DEBUG_tor
  fprintf(stderr, "GFS[2]: %d %d %d %d\n",
          region.x, region.y, region.width, region.height);
#endif

  nsCOMPtr<nsIContent> content = do_QueryInterface(aFilter);
  if (!content->HasAttr(kNameSpaceID_None, nsGkAtoms::x))
    region.x = defaultRegion.x;
  if (!content->HasAttr(kNameSpaceID_None, nsGkAtoms::y))
    region.y = defaultRegion.y;
  if (!content->HasAttr(kNameSpaceID_None, nsGkAtoms::width))
    region.width = defaultRegion.width;
  if (!content->HasAttr(kNameSpaceID_None, nsGkAtoms::height))
    region.height = defaultRegion.height;

  result->IntersectRect(filter, region);

#ifdef DEBUG_tor
  fprintf(stderr, "GFS[3]: %d %d %d %d\n",
          result->x, result->y, result->width, result->height);
#endif
}

already_AddRefed<gfxImageSurface>
nsSVGFilterInstance::GetImage()
{
  nsRefPtr<gfxImageSurface> surface =
    new gfxImageSurface(gfxIntSize(mFilterResX, mFilterResY),
                        gfxASurface::ImageFormatARGB32);

  if (!surface || surface->CairoStatus()) {
    return nsnull;
  }

  gfxContext ctx(surface);
  ctx.SetOperator(gfxContext::OPERATOR_CLEAR);
  ctx.Paint();

  gfxImageSurface *retval = nsnull;
  surface.swap(retval);
  return retval;
}

void
nsSVGFilterInstance::LookupImage(const nsAString &aName,
                                 gfxImageSurface **aImage,
                                 nsRect *aRegion,
                                 const ColorModel &aRequiredColorModel)
{
  ImageEntry *entry;

  if (aName.IsEmpty())
    entry = mLastImage;
  else
    mImageDictionary.Get(aName, &entry);

  if (entry) {
    *aImage = entry->mImage;
    NS_ADDREF(*aImage);
    *aRegion = entry->mRegion;

    if (aRequiredColorModel == entry->mColorModel)
      return;

    // convert image to desired format
    PRUint8 *data = (*aImage)->Data();
    PRInt32 stride = (*aImage)->Stride();

    if (entry->mColorModel.mAlphaChannel == ColorModel::PREMULTIPLIED)
      nsSVGUtils::UnPremultiplyImageDataAlpha(data, stride, entry->mRegion);

    if (aRequiredColorModel.mColorSpace != entry->mColorModel.mColorSpace) {

      if (aRequiredColorModel.mColorSpace == ColorModel::LINEAR_RGB)
        nsSVGUtils::ConvertImageDataToLinearRGB(data, stride, entry->mRegion);
      else
        nsSVGUtils::ConvertImageDataFromLinearRGB(data, stride, entry->mRegion);
    }
    if (aRequiredColorModel.mAlphaChannel == ColorModel::PREMULTIPLIED)
      nsSVGUtils::PremultiplyImageDataAlpha(data, stride, entry->mRegion);

    entry->mColorModel = aRequiredColorModel;

  } else {
    *aImage = nsnull;
    aRegion->Empty();
  }
}

nsSVGFilterInstance::ColorModel
nsSVGFilterInstance::LookupImageColorModel(const nsAString &aName)
{
  ImageEntry *entry;

  if (aName.IsEmpty())
    entry = mLastImage;
  else
    mImageDictionary.Get(aName, &entry);

  if (entry)
    return entry->mColorModel;

  // We'll reach this point if someone specifies a nonexistent input
  // for a filter, as feDisplacementMap need to find the color model
  // before the filter element calls AcquireSourceImage() which both
  // uses the color model and tells us if the input exists.

  return ColorModel(ColorModel::SRGB, ColorModel::PREMULTIPLIED);
}

void
nsSVGFilterInstance::DefineImage(const nsAString &aName,
                                 gfxImageSurface *aImage,
                                 const nsRect &aRegion,
                                 const ColorModel &aColorModel)
{
  ImageEntry *entry = new ImageEntry(aImage, aRegion, aColorModel);

  if (entry)
    mImageDictionary.Put(aName, entry);

  mLastImage = entry;
}
