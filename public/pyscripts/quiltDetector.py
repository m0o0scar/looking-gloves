from pyodide.ffi import to_js, create_proxy
import asyncio
import base64
from js import window, document
from js import console
from js import pyCreateObject, pyOnReady
import cv2
import numpy as np
import matplotlib.pyplot as plt


# Exporting all Global Python Objects to JavaScript
pyCreateObject(create_proxy(globals()), "pyodideGlobals")


# setup a function for the event listener to call
async def getQuiltColsRows(imageElement):
    # setup the canvas element, draw the quilt to the canvas, at reduced size
    DIM = 512
    canvas = document.createElement('canvas')
    canvas.width = DIM
    canvas.height = DIM
    ctx = canvas.getContext('2d')
    ctx.drawImage(imageElement, 0, 0, DIM, DIM)

    # convert the canvas into data! Then take that data and pass it into opencv
    dataurl = canvas.toDataURL()
    image_b64 = dataurl.split(",")[1]
    binary = base64.b64decode(image_b64)
    image = np.asarray(bytearray(binary), dtype="uint8")
    image = cv2.imdecode(image, 0)

    # taken from ↓ and modified
    # https://stackoverflow.com/a/72322879
    # Copyright 2022 Google LLC.
    # SPDX-License-Identifier: Apache-2.0

    # transform the image's frequency domain
    spectrum = np.fft.rfft2(image)
    # Partially whiten the spectrum. This tends to make the autocorrelation sharper,
    # but it also amplifies noise. The -0.6 exponent is the strength of the
    # whitening normalization, where -1.0 would be full normalization and 0.0 would
    # be the usual unnormalized autocorrelation.
    spectrum *= (1e-12 + np.abs(spectrum))**-0.6
    # Exclude some very low frequencies, since these are irrelevant to the texture.
    fx = np.arange(spectrum.shape[1])
    fy = np.fft.fftshift(np.arange(spectrum.shape[0]) - spectrum.shape[0] // 2)
    fx, fy = np.meshgrid(fx, fy)
    spectrum[np.sqrt(fx**2 + fy**2) < 10] = 0
    # Compute the autocorrelation and inverse transform.
    acorr = np.real(np.fft.irfft2(np.abs(spectrum)**2))

    # end google llc snippet

    # colormap and normalize it
    cmap = plt.cm.get_cmap('Greys')
    norm = plt.Normalize(vmin=0, vmax=np.percentile(acorr, 99.8))
    img = cmap(norm(acorr))

    # convert to cv2 image
    img = (img * 255).astype(np.uint8)

    # grayscale
    img = cv2.cvtColor(img, cv2.COLOR_RGBA2GRAY)
    img = cv2.bitwise_not(img)

    # blur
    BLUR = 4
    img = cv2.blur(img, (BLUR, BLUR))

    # threshold
    _, img = cv2.threshold(img, 100, 255, cv2.THRESH_BINARY)

    # erode and dilate
    kern_sz = 3
    kern = np.ones((kern_sz, kern_sz), np.uint8)
    img = cv2.erode(img, kern)
    img = cv2.dilate(img, kern)

    # set up a blob detector
    params = cv2.SimpleBlobDetector_Params()
    params.filterByArea = True
    params.minArea = 3
    params.maxArea = 30
    params.filterByColor = False
    params.filterByCircularity = False
    params.filterByInertia = False
    params.filterByConvexity = False
    detector = cv2.SimpleBlobDetector_create(params)

    # detect
    keypoints = detector.detect(img)

    # grab first keypoint, which is likely the corner, and guess views from it
    x_list = sorted([kp.pt[0] for kp in keypoints])
    y_list = sorted([kp.pt[1] for kp in keypoints])
    best_x = 0
    best_y = 0
    EDGE = 8
    for x in x_list:
        if x <= EDGE:
            continue
        if best_x == 0:
            best_x = x
            break

    for y in y_list:
        if y <= EDGE:
            continue
        if best_y == 0:
            best_y = y
            break

    if best_x == 0:
        best_x = DIM
    if best_y == 0:
        best_y = DIM

    cols = round(DIM / best_x)
    rows = round(DIM / best_y)

    # return result
    return [cols, rows]

pyOnReady()
